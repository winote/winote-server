import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, Validate } from "class-validator";
import { EmailUserUniqueValidator } from "../validation/email-unique.validation";

export class UpdateUserDto{

    id:number;
    
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    nickname:string;

    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @Expose()
    @ApiPropertyOptional()
    avatar:string;

    @Expose()
    @ApiPropertyOptional()
    birth_date:Date;

    @Expose()
    @ApiPropertyOptional()
    fcm_token: string;

}