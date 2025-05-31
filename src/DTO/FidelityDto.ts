/**
 * DTO para Programa de Fidelidade
 * Representa os dados do programa de fidelidade de um cliente
 */
export class FidelityDTO {
    /** ID único do registro de fidelidade */
    id?: string;
    /** ID do cliente associado */
    customerId!: string;
    /** Pontos acumulados pelo cliente */
    points!: number;
    /** Dados do cliente (opcional) */
    customer?: {
        id: string;
        name: string;
        phone: string;
    };
}

/**
 * DTO para Resposta do Programa de Fidelidade
 * Inclui informações adicionais como próximas recompensas
 */
export class FidelityResponseDTO {
    /** ID único do registro de fidelidade */
    id!: string;
    /** ID do cliente associado */
    customerId!: string;
    /** Pontos acumulados pelo cliente */
    points!: number;
    /** Dados do cliente */
    customer!: {
        id: string;
        name: string;
        phone: string;
    };
    /** Pontos necessários para a próxima recompensa */
    nextReward!: number;
    /** Total de serviços realizados */
    totalServices!: number;
} 