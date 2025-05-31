import { PrismaClient } from '@prisma/client';
import { CustomerDTO } from "../DTO/CustomerDto";

// Instância do cliente Prisma para operações no banco de dados
const prisma = new PrismaClient();

// Configuração padrão para incluir dados do barbeiro nas consultas
const includeBarber = {
    user: {
        select: {
            id: true,
            name: true,
            email: true
        }
    }
};

/**
 * Cria um novo cliente associado a um barbeiro
 * @param customerData - Dados do cliente (nome e telefone)
 * @param barberId - ID do barbeiro responsável
 * @returns Cliente criado com dados do barbeiro
 */
export async function createCustomer(customerData: CustomerDTO, barberId: string): Promise<CustomerDTO> {
    return await prisma.customer.create({
        data: {
            name: customerData.name,
            phone: customerData.phone,
            userId: barberId
        },
        include: includeBarber
    });
}

/**
 * Busca detalhes de um cliente específico
 * @param customerId - ID do cliente
 * @returns Dados do cliente com informações do barbeiro
 * @throws Error se o cliente não for encontrado
 */
export async function getCustomerDetails(customerId: string): Promise<CustomerDTO> {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: includeBarber
    });

    if (!customer) {
        throw new Error('Cliente não encontrado');
    }

    return customer;
}

/**
 * Lista todos os clientes do sistema
 * @returns Lista de clientes ordenada por nome
 */
export async function listCustomers(): Promise<CustomerDTO[]> {
    return await prisma.customer.findMany({
        include: includeBarber,
        orderBy: { name: 'asc' }
    });
}

/**
 * Atualiza dados de um cliente existente
 * @param customerId - ID do cliente
 * @param customerData - Novos dados do cliente
 * @returns Cliente atualizado
 */
export async function updateCustomer(customerId: string, customerData: CustomerDTO): Promise<CustomerDTO> {
    return await prisma.customer.update({
        where: { id: customerId },
        data: {
            name: customerData.name,
            phone: customerData.phone
        },
        include: includeBarber
    });
}

/**
 * Remove um cliente do sistema
 * @param customerId - ID do cliente a ser removido
 * @throws Error se o cliente não for encontrado ou não puder ser removido
 */
export async function deleteCustomer(customerId: string): Promise<void> {
    try {
        // Primeiro verifica se o cliente existe
        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            throw new Error('Cliente não encontrado');
        }

        // Tenta deletar o cliente
        await prisma.customer.delete({
            where: { id: customerId }
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao deletar cliente: ${error.message}`);
        }
        throw new Error('Erro ao deletar cliente');
    }
} 