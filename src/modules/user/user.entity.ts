import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { EmailUserUniqueValidator } from './validation/email-unique.validation';

@Entity('users')
export class User extends BaseEntity {

    constructor(o?: Partial<User>) {
        super(o);
        Object.assign(this, o);
    }

    @ApiProperty()
    @IsNotEmpty()
    @Column({ name: 'name', length: 255, nullable: false })
    name: string;

    @ApiProperty()
    @Validate(EmailUserUniqueValidator)
    @IsNotEmpty()
    @Column({ name: 'email', length: 255, nullable: false })
    email: string;

    @ApiPropertyOptional()
    @Column({ name: 'avatar', length: 255,})
    avatar:string;

    @ApiPropertyOptional()
    @Column({ name: 'birth_date', length: 255,})
    birth_date:string;

    @ApiPropertyOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ name: 'fcm_token', length: 255, nullable: false })
    fcm_token: string;

    @Column({ name: 'firebase_uid', nullable: true, length: 255 })
    firebaseUid: string;

    @Column({ name: 'guid', nullable: true, length: 36 })
    @ApiProperty({ required: false, description: 'The user guid' })
    guid: string;
}
