import { PrismaClient } from '@prisma/client';
import { ServiceDTO } from '../DTO/ServiceDto';
import { UserValidator } from '../validators/UserValidator';

const prisma = new PrismaClient();

// Select object for service details
const serviceSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    duration: true,
    userId: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true
        }
    }
};

/**
 * Função auxiliar para tratar erros em operações de serviço
 * @param operation - Função que realiza a operação no banco
 * @param errorMessage - Mensagem de erro personalizada
 */
async function handleServiceOperation<T>(
    operation: () => Promise<T>,
    errorMessage: string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        console.error(`Error in service operation: ${error}`);
        throw new Error(errorMessage);
    }
}

/**
 * Cria um novo serviço no sistema
 * @param serviceData - Dados do serviço a ser criado
 * @param userId - ID do barbeiro que está criando o serviço
 * @returns Serviço criado com dados do barbeiro
 */
export async function createService(serviceData: ServiceDTO, userId: string): Promise<ServiceDTO> {
    return handleServiceOperation(
        async () => {
            const service = await prisma.service.create({
                data: {
                    name: serviceData.name,
                    description: serviceData.description,
                    price: serviceData.price,
                    duration: serviceData.duration,
                    userId: userId
                },
                select: serviceSelect
            });
            return service;
        },
        'Erro ao criar serviço'
    );
}

/**
 * Busca detalhes de um serviço específico
 * @param id - ID do serviço
 * @returns Dados do serviço com informações do barbeiro
 * @throws Error se o serviço não for encontrado
 */
export async function getServiceDetails(id: string): Promise<ServiceDTO> {
    return handleServiceOperation(
        async () => {
            const service = await prisma.service.findUnique({
                where: { id },
                select: serviceSelect
            });

            if (!service) {
                throw new Error('Serviço não encontrado');
            }

            return service;
        },
        'Erro ao buscar detalhes do serviço'
    );
}

/**
 * Lista todos os serviços do sistema
 * @returns Lista de serviços ordenada por nome
 */
export async function listServices(): Promise<ServiceDTO[]> {
    return handleServiceOperation(
        async () => {
            return await prisma.service.findMany({
                select: serviceSelect,
                orderBy: { name: 'asc' }
            });
        },
        'Erro ao listar serviços'
    );
}

/**
 * Atualiza dados de um serviço existente
 * @param id - ID do serviço
 * @param serviceData - Novos dados do serviço
 * @returns Serviço atualizado
 * @throws Error se o serviço não for encontrado
 */
export async function updateService(id: string, serviceData: ServiceDTO): Promise<ServiceDTO> {
    return handleServiceOperation(
        async () => {
            const service = await prisma.service.update({
                where: { id },
                data: {
                    name: serviceData.name,
                    description: serviceData.description,
                    price: serviceData.price,
                    duration: serviceData.duration
                },
                select: serviceSelect
            });

            if (!service) {
                throw new Error('Serviço não encontrado');
            }

            return service;
        },
        'Erro ao atualizar serviço'
    );
}

/**
 * Remove um serviço do sistema
 * @param id - ID do serviço a ser removido
 */
export async function deleteService(id: string): Promise<void> {
    return handleServiceOperation(
        async () => {
            await prisma.service.delete({
                where: { id }
            });
        },
        'Erro ao remover serviço'
    );
} 