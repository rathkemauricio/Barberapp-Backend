import { UserDTO } from "./UserDto";

/**
 * DTO para Cliente (Customer)
 * Representa os dados de um cliente no sistema
 */
export class CustomerDTO {
    /** ID único do cliente */
    id?: string;
    /** Nome completo do cliente */
    name!: string;
    /** Número de telefone do cliente */
    phone!: string;
    /** ID do barbeiro/usuário responsável pelo cliente */
    userId?: string;
    /** Dados do barbeiro/usuário responsável */

    email?: string;
    user?: UserDTO;
    //appointments: AppointmentDto[];
    //fidelity: FidelityDto;
}