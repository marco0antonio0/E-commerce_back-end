import { IsString, IsEmail, IsStrongPassword, IsNumberString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class userDTO {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the user',
    })
    @IsNumberString()
    @IsOptional()
    id?: number

    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user',
    })
    @IsStrongPassword({ minLength: 0, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    @IsNotEmpty()
    password: string
}
