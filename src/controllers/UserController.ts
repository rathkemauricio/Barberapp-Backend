import { Response, Request as ExpressRequest } from "express";
import { BaseController } from "./BaseController";
import { createUser, authenticateUser, getUserDetails } from "../handlers/UserHandler";
import { UserDTO } from "../DTO/UserDto";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Post, Get } from "../decorators/Route";

// Controlador responsável por gerenciar operações relacionadas a usuários
export class UserController extends BaseController {
    // Endpoint para criar um novo usuário
    @Post('/users')
    async create(req: ExpressRequest, res: Response) {
        try {
            const newUser = await createUser(req.body as UserDTO);
            this.sendResponse(res, newUser);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para autenticar um usuário (login)
    @Post('/session')
    async authenticate(req: ExpressRequest, res: Response) {
        try {
            const auth = await authenticateUser(req.body as UserDTO);
            this.sendResponse(res, auth);
        } catch (error) {
            this.sendError(res, error);
        }
    }

    // Endpoint para obter detalhes do usuário logado
    // Requer autenticação
    @Get('/me', isAuthenticated)
    async getDetails(req: ExpressRequest, res: Response) {
        try {
            const user = await getUserDetails(this.getCurrentUser(req).id);
            this.sendResponse(res, user);
        } catch (error) {
            this.sendError(res, error);
        }
    }
} 