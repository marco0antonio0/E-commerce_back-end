import { IsJWT } from "class-validator";

export class TokenDTO {
    @IsJWT()
    token: string
}