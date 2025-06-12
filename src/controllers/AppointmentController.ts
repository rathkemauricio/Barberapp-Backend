import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { createAppointment, getAppointmentDetails, listAppointments, updateAppointment, deleteAppointment } from "../handlers/AppointmentHandler";
import { AppointmentDTO } from "../DTO/AppointmentDto";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Post, Get, Put, Delete } from "../decorators/Route";

// Controlador responsável por gerenciar operações relacionadas a agendamentos
export class AppointmentController extends BaseController {
    // Endpoint para criar um novo agendamento
    // Requer autenticação
    @Post('/appointments')
    async create(req: ExpressRequest, res: Response) {
        try {
            const appointmentData = req.body as AppointmentDTO;

            // Converte a data para um objeto Date
            if (typeof appointmentData.date === 'string') {
                appointmentData.date = new Date(appointmentData.date);
            }

            const appointment = await createAppointment(appointmentData, this.getCurrentUser(req).id);
            this.sendResponse(res, appointment);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para obter detalhes de um agendamento específico pelo ID
    // Requer autenticação
    @Get('/appointments')
    async getDetails(req: ExpressRequest, res: Response) {
        const appointmentId = req.query.appointmentId as string;
        if (!appointmentId) {
            return this.sendError(res, new Error("ID do agendamento não fornecido"), 400);
        }
        const appointment = await getAppointmentDetails(appointmentId);
        this.sendResponse(res, appointment);
    }

    // Endpoint para listar todos os agendamentos do barbeiro logado
    // Requer autenticação
    @Get('/appointments/list')
    async list(req: ExpressRequest, res: Response) {
        const appointments = await listAppointments(this.getCurrentUser(req).id);
        this.sendResponse(res, appointments);
    }

    // Endpoint para atualizar um agendamento existente pelo ID
    // Requer autenticação
    @Put('/appointments')
    async update(req: ExpressRequest, res: Response) {
        try {
            const appointmentId = req.query.appointmentId as string;
            if (!appointmentId) {
                return this.sendError(res, new Error("ID do agendamento não fornecido"), 400);
            }

            const appointmentData = req.body as AppointmentDTO;

            // Converte a data para um objeto Date se fornecida
            if (appointmentData.date && typeof appointmentData.date === 'string') {
                appointmentData.date = new Date(appointmentData.date);
            }

            const appointment = await updateAppointment(appointmentId, appointmentData);
            this.sendResponse(res, appointment);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para deletar um agendamento pelo ID
    // Requer autenticação
    @Delete('/appointments')
    async delete(req: ExpressRequest, res: Response) {
        const appointmentId = req.query.appointmentId as string;
        if (!appointmentId) {
            return this.sendError(res, new Error("ID do agendamento não fornecido"), 400);
        }
        await deleteAppointment(appointmentId);
        this.sendResponse(res, { message: "Agendamento removido com sucesso" });
    }
} 