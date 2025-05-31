export class ServiceDTO {
    id?: string;
    name: string = '';
    description: string = '';
    price: number = 0;
    duration: number = 0; // Duration in minutes
    userId?: string; // The barber who created/offers this service
} 