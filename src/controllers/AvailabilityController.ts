import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Get } from "../decorators/Route";
import { checkBarberAvailability, listAvailableDates } from "../handlers/AvailabilityHandler";

// Controlador responsável por gerenciar operações relacionadas à disponibilidade do barbeiro
export class AvailabilityController extends BaseController {
    // Endpoint para listar todas as datas disponíveis para agendamento
    // Requer autenticação
    @Get('/availability/dates')
    async listDates(req: ExpressRequest, res: Response) {
        const dates = await listAvailableDates(this.getCurrentUser(req).id);
        this.sendResponse(res, dates);
    }

    // Endpoint para verificar os horários disponíveis em uma data específica
    // Requer autenticação
    // A data deve ser fornecida como query parameter (?date=...)
    @Get('/availability/slots')
    async checkAvailability(req: ExpressRequest, res: Response) {
        const { date } = req.query;

        if (!date || typeof date !== 'string') {
            return this.sendError(res, new Error('Data não fornecida'), 400);
        }

        const slots = await checkBarberAvailability(this.getCurrentUser(req).id, date);
        this.sendResponse(res, slots);
    }
} 