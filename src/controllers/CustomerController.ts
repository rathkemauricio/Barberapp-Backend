import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { createCustomer, getCustomerDetails, listCustomers, updateCustomer, deleteCustomer } from "../handlers/CustomerHandler";
import { CustomerDTO } from "../DTO/CustomerDto";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Post, Get, Put, Delete } from "../decorators/Route";

// Controlador responsável por gerenciar operações relacionadas a clientes
export class CustomerController extends BaseController {
    // Endpoint para criar um novo cliente
    // Requer autenticação
    @Post('/customers', isAuthenticated)
    async create(req: ExpressRequest, res: Response) {
        try {
            const customer = await createCustomer(req.body as CustomerDTO, this.getCurrentUser(req).id);
            this.sendResponse(res, customer);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para obter detalhes de um cliente específico pelo ID
    // Requer autenticação
    @Get('/customers', isAuthenticated)
    async getDetails(req: ExpressRequest, res: Response) {
        try {
            const customerId = req.query.customerId as string;
            if (!customerId) {
                return this.sendError(res, new Error("ID do cliente não fornecido"), 400);
            }
            const customer = await getCustomerDetails(customerId);
            this.sendResponse(res, customer);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para listar todos os clientes
    // Requer autenticação
    @Get('/customers/list', isAuthenticated)
    async list(req: ExpressRequest, res: Response) {
        try {
            const customers = await listCustomers();
            this.sendResponse(res, customers);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para atualizar um cliente existente
    // Requer autenticação
    @Put('/customers', isAuthenticated)
    async update(req: ExpressRequest, res: Response) {
        try {
            const customerId = req.query.customerId as string;
            if (!customerId) {
                return this.sendError(res, new Error("ID do cliente não fornecido"), 400);
            }
            const customer = await updateCustomer(customerId, req.body as CustomerDTO);
            this.sendResponse(res, customer);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para deletar um cliente pelo ID
    // Requer autenticação
    @Delete('/customers', isAuthenticated)
    async delete(req: ExpressRequest, res: Response) {
        try {
            const customerId = req.query.customerId as string;
            if (!customerId) {
                return this.sendError(res, new Error("ID do cliente não fornecido"), 400);
            }
            await deleteCustomer(customerId);
            this.sendResponse(res, { message: "Cliente removido com sucesso" });
        } catch (error) {
            this.sendError(res, error);
        }
    }
} 