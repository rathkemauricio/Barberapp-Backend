import { BaseValidator } from "./BaseValidator";
import { UserDTO } from "../DTO/UserDto";

export class UserValidator extends BaseValidator {
    validateCreate(userData: UserDTO): void {
        this.validateRequiredFields(userData, ['name', 'email', 'password']);
        this.validateEmail(userData.email);
    }

    validateAuth(userData: UserDTO): void {
        this.validateRequiredFields(userData, ['email', 'password']);
        this.validateEmail(userData.email);
    }
} 