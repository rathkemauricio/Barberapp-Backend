import { Request, Response, Router } from "express";
import { RouteDefinition } from "../decorators/Route";

declare global {
    namespace Express {
        interface Request {
            user_id: string;
        }
    }
}

export abstract class BaseController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        const routes = (this as any).routes || [];

        routes.forEach((route: RouteDefinition) => {
            const handler = route.handler.bind(this);
            const middlewares = route.middlewares || [];

            this.router[route.method](
                route.path,
                ...middlewares,
                handler
            );
        });
    }

    protected getCurrentUser(req: Request) {
        return {
            id: req.user_id,
            // Adicione outros campos do usuário que você queira acessar
        };
    }

    protected sendResponse<T>(res: Response, data: T, statusCode: number = 200) {
        return res.status(statusCode).json(data);
    }

    protected sendError(res: Response, error: any, statusCode: number = 400) {
        return res.status(statusCode).json({ error: error.message });
    }
} 