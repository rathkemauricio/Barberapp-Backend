/**
 * DTO para Usuário (User)
 * Representa os dados de um usuário/barbeiro no sistema
 */
import { Role } from '../enums/Role';

export interface UserDTO {
    /** ID único do usuário */
    id?: string;
    /** Nome completo do usuário */
    name?: string;
    /** Email do usuário (usado para login) */
    email?: string;
    /** Senha do usuário (opcional, usado apenas em operações de autenticação) */
    password?: string;
    /** Token JWT para autenticação (opcional, retornado após login) */
    token?: string;
    /** Role do usuário */
    role?: Role;
}




