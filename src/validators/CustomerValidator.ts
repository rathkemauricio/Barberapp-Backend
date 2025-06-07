import { BaseValidator } from "./BaseValidator";
import { CustomerDTO } from "../DTO/CustomerDto";

export class CustomerValidator extends BaseValidator {
    validateCreate(customerData: CustomerDTO): void {
        this.validateRequiredFields(customerData, ['name', 'phone', 'email', 'password']);
        this.validateEmail(customerData.email!);
    }

    validateAuth(customerData: CustomerDTO): void {
        this.validateRequiredFields(customerData, ['email', 'password']);
        this.validateEmail(customerData.email!);
    }
} 