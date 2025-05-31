// DTO para agendamento (Appointment)
export interface AppointmentDTO {
    /** ID do agendamento */
    id?: string;
    /** Data do agendamento */
    date: Date;
    /** Horário do agendamento */
    time: string;
    /** Status do agendamento */
    status?: string;
    /** Nome do serviço */
    service: string;
    /** ID do serviço (pode ser nulo) */
    serviceId?: string | null;
    /** ID do cliente */
    customerId: string;
    /** ID do usuário/barbeiro */
    userId?: string;
    /** Dados do cliente (opcional) */
    customer?: { id: string; name: string; phone: string };
    /** Dados do usuário/barbeiro (opcional) */
    user?: { id: string; name: string; email: string };
} 