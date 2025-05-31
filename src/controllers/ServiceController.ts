import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { createService, getServiceDetails, listServices, updateService, deleteService } from "../handlers/ServiceHandler";
import { ServiceDTO } from "../DTO/ServiceDto";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Post, Get, Put, Delete } from "../decorators/Route";

// Controlador responsável por gerenciar operações relacionadas a serviços
export class ServiceController extends BaseController {
    // Endpoint para criar um novo serviço
    // Requer autenticação
    @Post('/services', isAuthenticated)
    async create(req: ExpressRequest, res: Response) {
        const service = await createService(req.body as ServiceDTO, this.getCurrentUser(req).id);
        this.sendResponse(res, service);
    }

    // Endpoint para obter detalhes de um serviço específico pelo ID
    // Requer autenticação
    @Get('/services', isAuthenticated)
    async getDetails(req: ExpressRequest, res: Response) {
        const serviceId = req.query.serviceId as string;
        if (!serviceId) {
            return this.sendError(res, new Error("ID do serviço não fornecido"), 400);
        }
        const service = await getServiceDetails(serviceId);
        this.sendResponse(res, service);
    }

    // Endpoint para listar todos os serviços
    // Requer autenticação
    @Get('/services/list', isAuthenticated)
    async list(req: ExpressRequest, res: Response) {
        const services = await listServices();
        this.sendResponse(res, services);
    }

    // Endpoint para atualizar um serviço existente pelo ID
    // Requer autenticação
    @Put('/services', isAuthenticated)
    async update(req: ExpressRequest, res: Response) {
        const serviceId = req.query.serviceId as string;
        if (!serviceId) {
            return this.sendError(res, new Error("ID do serviço não fornecido"), 400);
        }
        const service = await updateService(serviceId, req.body as ServiceDTO);
        this.sendResponse(res, service);
    }

    // Endpoint para deletar um serviço pelo ID
    // Requer autenticação
    @Delete('/services', isAuthenticated)
    async delete(req: ExpressRequest, res: Response) {
        const serviceId = req.query.serviceId as string;
        if (!serviceId) {
            return this.sendError(res, new Error("ID do serviço não fornecido"), 400);
        }
        await deleteService(serviceId);
        this.sendResponse(res, { message: "Serviço removido com sucesso" });
    }
} 