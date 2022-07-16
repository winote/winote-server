import { Inject, Injectable, Logger } from '@nestjs/common';
import { Service } from '../../shared/decorators/service';
import { User } from './user.entity';
import { UserRepository} from './user.repository';
import { FirebaseProvider } from '../../shared/provider/firebase.provider';
import { Auth } from 'firebase-admin/lib/auth';
import { v4 as uuid } from 'uuid';

// import UserRecord = Auth.UserRecord;
// import CreateRequest = Auth.CreateRequest;

@Service()
@Injectable()
export class UserService{

    private readonly LOGGER: Logger = new Logger(UserService.name);

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {   }

    async findByEmail(email: string): Promise<User> {
        const user =  await this.userRepository.findOne({
            where: [{ email }]
        });
        return user;
    }

    async findByToken(token: string): Promise<User> {
        return await this.userRepository.findOne({
            where: [{ token: token }],
            join: {
                alias: 'user',
                innerJoinAndSelect: {
                    client: 'user.client',
                },
            },
        });
    }

    public async findUserByGuid(guid:string): Promise<User>{
        return await this.userRepository.findOne({
            where: [{guid: guid}],
            join: {
                alias: 'user',
                innerJoinAndSelect: {
                    client: 'user.client',
                },
            },
        })
    }

    public async getUserCompanies(guid:string):Promise<User> {
        return await this.userRepository.findOne({
            where: [{ guid: guid }],
            join: {
                alias: 'user',
                innerJoinAndSelect: {
                    company: 'user.company',
                },
            },
        });
    }

    async create(entity: User): Promise<User> {
        try {

            entity.guid = uuid();
            return await this.userRepository.create(entity);
        } catch (e) {
            await this.deleteFirebaseUser(entity);
            throw e;
        }
    }

    protected async beforeCreate(entity: User): Promise<User> {
        await this.createFirebaseUser(entity);
        return entity;
    }

    protected async beforeUpdate(entity: User): Promise<User> {
        
        await this.updateFirebaseUser(entity,false);
        return entity;
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
            emailVerified: false,
            disabled: false,
        };
        return request;
    }

}
