import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuração do horário de funcionamento da barbearia
const WORKING_HOURS = {
    start: 9, // 9:00
    end: 18,  // 18:00
    interval: 30 // Intervalo de 30 minutos entre horários
};

/**
 * Gera todos os horários possíveis para um dia
 * @param date - Data para gerar os horários
 * @returns Array com todos os horários possíveis no formato HH:mm
 */
function generateTimeSlots(date: Date): string[] {
    const slots: string[] = [];
    const startTime = new Date(date);
    startTime.setHours(WORKING_HOURS.start, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(WORKING_HOURS.end, 0, 0, 0);

    while (startTime < endTime) {
        slots.push(startTime.toTimeString().slice(0, 5)); // Formato HH:mm
        startTime.setMinutes(startTime.getMinutes() + WORKING_HOURS.interval);
    }

    return slots;
}

/**
 * Verifica disponibilidade para um barbeiro em uma data específica
 * @param userId - ID do barbeiro
 * @param date - Data a ser verificada
 * @returns Array com horários e sua disponibilidade
 */
export async function checkBarberAvailability(userId: string, date: string): Promise<{ time: string; available: boolean }[]> {
    const dateObj = new Date(date);
    const allSlots = generateTimeSlots(dateObj);

    // Busca todos os agendamentos do barbeiro para a data
    const appointments = await prisma.appointment.findMany({
        where: {
            userId,
            date: {
                gte: new Date(dateObj.setHours(0, 0, 0, 0)),
                lt: new Date(dateObj.setHours(23, 59, 59, 999))
            }
        },
        select: {
            time: true
        }
    });

    // Marca os horários ocupados
    const bookedTimes = new Set(appointments.map(a => a.time));

    // Retorna array com disponibilidade de cada horário
    return allSlots.map(time => ({
        time,
        available: !bookedTimes.has(time)
    }));
}

/**
 * Verifica se um horário específico está disponível
 * @param userId - ID do barbeiro
 * @param date - Data a ser verificada
 * @param time - Horário a ser verificado
 * @returns true se o horário estiver disponível, false caso contrário
 */
export async function isTimeSlotAvailable(userId: string, date: string, time: string): Promise<boolean> {
    const existingAppointment = await prisma.appointment.findFirst({
        where: {
            userId,
            date: new Date(date),
            time
        }
    });

    return !existingAppointment;
}

/**
 * Lista todas as datas disponíveis para os próximos 30 dias
 * @param userId - ID do barbeiro
 * @returns Array com datas e sua disponibilidade
 */
export async function listAvailableDates(userId: string): Promise<{ date: string; available: boolean }[]> {
    const dates: { date: string; available: boolean }[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Verifica se há pelo menos um horário disponível neste dia
        const availability = await checkBarberAvailability(userId, date.toISOString().split('T')[0]);
        const hasAvailableSlots = availability.some(slot => slot.available);

        dates.push({
            date: date.toISOString().split('T')[0],
            available: hasAvailableSlots
        });
    }

    return dates;
} 