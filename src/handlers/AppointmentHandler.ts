import { PrismaClient } from '@prisma/client';
import { AppointmentDTO } from '../DTO/AppointmentDto';
import { isTimeSlotAvailable } from './AvailabilityHandler';

const prisma = new PrismaClient();

// Select object for appointment details
const appointmentSelect = {
    id: true,
    date: true,
    time: true,
    status: true,
    service: true,
    userId: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true
        }
    },
    customerId: true,
    customer: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    }
};

/**
 * Cria um novo agendamento no sistema
 * @param appointmentData - Dados do agendamento a ser criado
 * @param userId - ID do barbeiro responsável
 * @returns Agendamento criado com dados do barbeiro e cliente
 * @throws Error se o horário não estiver disponível
 */
export async function createAppointment(appointmentData: AppointmentDTO, userId: string): Promise<AppointmentDTO> {
    // Verifica disponibilidade do horário
    const isAvailable = await isTimeSlotAvailable(
        userId,
        appointmentData.date.toISOString().split('T')[0],
        appointmentData.time
    );

    if (!isAvailable) {
        throw new Error('Horário não disponível');
    }

    const appointment = await prisma.appointment.create({
        data: {
            date: new Date(appointmentData.date),
            time: appointmentData.time,
            status: appointmentData.status || 'scheduled',
            service: appointmentData.service,
            userId: userId,
            customerId: appointmentData.customerId
        },
        select: appointmentSelect
    });

    return appointment;
}

/**
 * Busca detalhes de um agendamento específico
 * @param id - ID do agendamento
 * @returns Dados do agendamento com informações do barbeiro e cliente
 * @throws Error se o agendamento não for encontrado
 */
export async function getAppointmentDetails(id: string): Promise<AppointmentDTO> {
    const appointment = await prisma.appointment.findUnique({
        where: { id },
        select: appointmentSelect
    });

    if (!appointment) {
        throw new Error('Agendamento não encontrado');
    }

    return appointment;
}

/**
 * Lista todos os agendamentos de um barbeiro
 * @param userId - ID do barbeiro
 * @returns Lista de agendamentos ordenada por data e hora
 */
export async function listAppointments(userId: string): Promise<AppointmentDTO[]> {
    return await prisma.appointment.findMany({
        where: { userId },
        select: appointmentSelect,
        orderBy: [
            { date: 'asc' },
            { time: 'asc' }
        ]
    });
}

/**
 * Atualiza dados de um agendamento existente
 * @param id - ID do agendamento
 * @param appointmentData - Novos dados do agendamento
 * @returns Agendamento atualizado
 * @throws Error se o horário não estiver disponível ou o agendamento não for encontrado
 */
export async function updateAppointment(id: string, appointmentData: AppointmentDTO): Promise<AppointmentDTO> {
    // Se estiver alterando data/hora, verifica disponibilidade
    if (appointmentData.date && appointmentData.time) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!appointment) {
            throw new Error('Agendamento não encontrado');
        }

        const isAvailable = await isTimeSlotAvailable(
            appointment.userId,
            appointmentData.date.toISOString().split('T')[0],
            appointmentData.time
        );

        if (!isAvailable) {
            throw new Error('Horário não disponível');
        }
    }

    const appointment = await prisma.appointment.update({
        where: { id },
        data: {
            date: appointmentData.date ? new Date(appointmentData.date) : undefined,
            time: appointmentData.time,
            status: appointmentData.status,
            service: appointmentData.service
        },
        select: appointmentSelect
    });

    return appointment;
}

/**
 * Remove um agendamento do sistema
 * @param id - ID do agendamento a ser removido
 */
export async function deleteAppointment(id: string): Promise<void> {
    await prisma.appointment.delete({
        where: { id }
    });
} 