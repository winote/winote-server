import { HttpException, HttpStatus, Inject, Injectable, Logger, PreconditionFailedException } from '@nestjs/common';
import { Service } from '../../shared/decorators/service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { FirebaseProvider } from '../../shared/provider/firebase.provider';
import { Auth } from 'firebase-admin/lib/auth';
import { v4 as uuid } from 'uuid';
import { UpdateUserDto } from './dto/updateUser.dto';
import { StorageService } from '../storage/storage.service';

// import UserRecord = Auth.UserRecord;
// import CreateRequest = Auth.CreateRequest;

@Service()
@Injectable()
export class UserService {

    private readonly LOGGER: Logger = new Logger(UserService.name);

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        private readonly storageService: StorageService,
    ) { }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: [{ email }]
        });
        return user;
    }

    public async findUserByGuid(guid: string): Promise<User> {
        return await this.userRepository.findOne({
            where: [{ guid: guid }],
        })
    }

    async create(entity: User): Promise<User> {
        try {
            entity = await this.beforeCreate(entity);
            entity.guid = uuid();
            entity.createdAt = new Date();
            const user = await this.userRepository.create(entity);
            return this.userRepository.save(user);
        } catch (e) {
            await this.deleteFirebaseUser(entity);
            throw new HttpException("User not created", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }


    protected async beforeCreate(entity: User): Promise<User> {
        await this.createFirebaseUser(entity);
        return entity;
    }

    async update(entity: UpdateUserDto) {
        const user: User = await this.findByEmail(entity.email);
        if (user) {
            entity.id = user.id;
            entity = await this.beforeUpdate(entity);
            return this.userRepository.update(entity.id, entity);
        } else {
            throw new PreconditionFailedException('user not found')
        }
    }

    protected async beforeUpdate(user: UpdateUserDto): Promise<UpdateUserDto> {

        if (user.avatar) {
            user = await this.saveProfilePic(user)
        }
        return user;
    }

    protected async saveProfilePic(user: UpdateUserDto) {
        console.log(user.id);
        const filePath = `${user.id}/profile/profile.png`;
        const firebasePath = await this.storageService.uploadFileForUser(filePath, 'image/png', user.avatar);
        user.avatar = firebasePath;
        this.LOGGER.log("FirebasePath", firebasePath);
        return user;
    }

    protected async afterDelete(entity: User): Promise<User> {
        await this.deleteFirebaseUser(entity);
        return entity;
    }

    private async createFirebaseUser(user: User): Promise<void> {
        await FirebaseProvider.authAdmin(async (auth: Auth) => {
            try {
                const createRequest = this.createFirebaseUserCreateRequest(user, true);
                const userRecord = await auth.createUser(createRequest);
                user.firebaseUid = userRecord.uid;
            } catch (e) {
                console.log(e.name);
            }
        });
    }

    private async updateFirebaseUser(user: User, passwordChanged: boolean): Promise<void> {
        await FirebaseProvider.authAdmin(async (auth: Auth) => {

            if (user.firebaseUid) {
                const createRequest = this.createFirebaseUserCreateRequest(user, passwordChanged);
                await auth.updateUser(user.firebaseUid, createRequest);

                // even if the user doesn't exists, if we have a new password, we are able to register in firebase
            } else if (passwordChanged) {
                await this.createFirebaseUser(user);

            } else {
                this.LOGGER.warn(`User ${user.id} has been updated and don't have a Firebase registration!`);
            }
        });
    }

    private async deleteFirebaseUser(user: User): Promise<void> {
        await FirebaseProvider.authAdmin(async (auth: Auth) => {
            // Search in firebase when will delete to guaranties that the user will be deleted
            const userRecord = await auth.getUserByEmail(user.email);
            if (userRecord) {
                await auth.deleteUser(userRecord.uid);
            }
        });
    }

    private createFirebaseUserCreateRequest(entity: User, changePassword: boolean) {
        const request = {
            email: entity.email,
            displayName: entity.name,
            password: entity.password,
            emailVerified: false,
            disabled: false,
        };
        return request;
    }

}
