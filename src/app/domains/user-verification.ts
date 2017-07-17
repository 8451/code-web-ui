import { User } from './user';

export class UserVerification {
    user: User;
    currentPassword: string;

    constructor(user: User, password: string) {
        this.user = user;
        this.currentPassword = password;
    }
}
