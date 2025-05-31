import { PrismaClient } from '@prisma/client';
import { FidelityDTO, FidelityResponseDTO } from "../DTO/FidelityDto";

const prisma = new PrismaClient();

/**
 * Constantes do programa de fidelidade
 */
const POINTS_PER_SERVICE = 1;    // Pontos ganhos por serviço
const POINTS_FOR_REWARD = 10;    // Pontos necessários para uma recompensa

/**
 * Seleção padrão para dados do cliente
 */
const customerSelect = {
    id: true,
    name: true,
    phone: true
};

/**
 * Inclusão padrão para relacionamentos
 */
const includeCustomer = {
    customer: {
        select: {
            id: true,
            name: true,
            phone: true
        }
    }
};

/**
 * Calcula métricas do programa de fidelidade
 * @param points Pontos atuais do cliente
 * @returns Objeto com próximas recompensas e total de serviços
 */
function calculateFidelityMetrics(points: number) {
    return {
        nextReward: POINTS_FOR_REWARD - (points % POINTS_FOR_REWARD),
        totalServices: Math.floor(points / POINTS_PER_SERVICE)
    };
}

/**
 * Handler genérico para operações de fidelidade
 * Centraliza o tratamento de erros
 */
async function handleFidelityOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        throw new Error("Erro ao processar fidelidade");
    }
}

/**
 * Adiciona pontos de fidelidade para um cliente
 * @param customerId ID do cliente
 * @param points Pontos a serem adicionados
 * @returns Dados atualizados do programa de fidelidade
 */
export async function addPoints(customerId: string, points: number): Promise<FidelityResponseDTO> {
    const fidelity = await prisma.fidelity.upsert({
        where: { customerId },
        update: { points: { increment: points } },
        create: { customerId, points },
        include: includeCustomer
    });
    const metrics = calculateFidelityMetrics(fidelity.points);
    return { ...fidelity, ...metrics };
}

/**
 * Busca os detalhes do programa de fidelidade de um cliente
 * @param customerId ID do cliente
 * @throws Error se o cliente não tiver programa de fidelidade
 */
export async function getFidelityDetails(customerId: string): Promise<FidelityResponseDTO> {
    const fidelity = await prisma.fidelity.findUnique({
        where: { customerId },
        include: includeCustomer
    });
    if (!fidelity) {
        throw new Error('Fidelidade não encontrada');
    }
    const metrics = calculateFidelityMetrics(fidelity.points);
    return { ...fidelity, ...metrics };
}

/**
 * Reseta os pontos de fidelidade de um cliente
 * @param customerId ID do cliente
 * @returns Dados atualizados do programa de fidelidade
 */
export async function resetPoints(customerId: string): Promise<FidelityResponseDTO> {
    const fidelity = await prisma.fidelity.update({
        where: { customerId },
        data: { points: 0 },
        include: includeCustomer
    });
    return {
        ...fidelity,
        nextReward: POINTS_FOR_REWARD,
        totalServices: 0
    };
} 