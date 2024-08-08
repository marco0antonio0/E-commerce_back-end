import { PickType } from "@nestjs/swagger";
import { userDTO } from "./user.dto";

export class user_idDTO extends PickType(userDTO, ['id'] as const) { }
export class user_emailDTO extends PickType(userDTO, ['email'] as const) { }
export class user_loginDTO extends PickType(userDTO, ['email', 'password'] as const) { }