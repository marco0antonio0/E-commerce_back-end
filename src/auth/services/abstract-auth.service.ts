import { user_emailDTO } from 'src/user/models/user-models.dto';
import { TokenDTO } from '../models/token.dto';

export abstract class AbstractAuthService {
    abstract createToken(userEmailDTO: user_emailDTO): Promise<string>;

    abstract checkToken(tokenDTO: TokenDTO): Promise<any>;
}
