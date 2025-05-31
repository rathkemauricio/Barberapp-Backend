import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Post, Get } from "../decorators/Route";
import { addPoints, getFidelityDetails, resetPoints } from "../handlers/FidelityHandler";

// Controlador responsável por gerenciar operações relacionadas ao programa de fidelidade
export class FidelityController extends BaseController {
    // Endpoint para adicionar pontos de fidelidade a um cliente
    // Requer autenticação
    // Necessita do ID do cliente e quantidade de pontos no body da requisição
    @Post('/fidelity/add-points', isAuthenticated)
    async addPoints(req: ExpressRequest, res: Response) {
        const fidelity = await addPoints(req.body.customerId, req.body.points);
        this.sendResponse(res, fidelity);
    }

    // Endpoint para obter detalhes do programa de fidelidade de um cliente
    // Requer autenticação
    // O ID do cliente é passado como parâmetro na URL
    @Get('/fidelity/:customerId', isAuthenticated)
    async getDetails(req: ExpressRequest, res: Response) {
        const fidelity = await getFidelityDetails(req.params.customerId);
        this.sendResponse(res, fidelity);
    }

    // Endpoint para resetar os pontos de fidelidade de um cliente
    // Requer autenticação
    // Necessita do ID do cliente no body da requisição
    @Post('/fidelity/reset-points', isAuthenticated)
    async resetPoints(req: ExpressRequest, res: Response) {
        const fidelity = await resetPoints(req.body.customerId);
        this.sendResponse(res, fidelity);
    }
} 