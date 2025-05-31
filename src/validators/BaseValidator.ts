export abstract class BaseValidator {
    protected validateRequiredFields(data: any, fields: string[]): void {
        const missingFields = fields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }
    }

    protected validateEmail(email: string): void {
        if (!email.includes('@')) {
            throw new Error('Email inválido');
        }
    }
} 