/**
 * Converte minutos para formato HH:mm
 */
export function minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Converte string HH:mm para minutos
 */
export function timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Adiciona minutos a um horário
 */
export function addMinutesToTime(time: string, minutes: number): string {
    const totalMinutes = timeStringToMinutes(time) + minutes;
    return minutesToTimeString(totalMinutes);
}

/**
 * Gera todos os horários disponíveis para um dia
 */
export function generateTimeSlots(startTime: string, endTime: string, interval: number = 30): string[] {
    const slots: string[] = [];
    let currentTime = startTime;

    while (timeStringToMinutes(currentTime) < timeStringToMinutes(endTime)) {
        slots.push(currentTime);
        currentTime = addMinutesToTime(currentTime, interval);
    }

    return slots;
}

/**
 * Verifica se um horário está disponível considerando a duração do serviço
 */
export function isTimeSlotAvailable(
    currentTime: string,
    serviceDuration: number,
    existingAppointments: { time: string; endTime: string }[]
): boolean {
    const serviceEndTime = addMinutesToTime(currentTime, serviceDuration);

    // Verifica se o horário não conflita com nenhum agendamento existente
    return !existingAppointments.some(appointment => {
        const appointmentStart = timeStringToMinutes(appointment.time);
        const appointmentEnd = timeStringToMinutes(appointment.endTime);
        const serviceStart = timeStringToMinutes(currentTime);
        const serviceEnd = timeStringToMinutes(serviceEndTime);

        return (
            (serviceStart >= appointmentStart && serviceStart < appointmentEnd) ||
            (serviceEnd > appointmentStart && serviceEnd <= appointmentEnd) ||
            (serviceStart <= appointmentStart && serviceEnd >= appointmentEnd)
        );
    });
}

/**
 * Gera horários disponíveis para um serviço específico
 */
export function getAvailableTimeSlots(
    date: Date,
    serviceDuration: number,
    existingAppointments: { time: string; endTime: string }[],
    startTime: string = '09:00',
    endTime: string = '18:00',
    interval: number = 30
): string[] {
    const allSlots = generateTimeSlots(startTime, endTime, interval);

    return allSlots.filter(slot =>
        isTimeSlotAvailable(slot, serviceDuration, existingAppointments)
    );
} 