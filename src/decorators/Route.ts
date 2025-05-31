import { RequestHandler } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteDefinition {
    path: string;
    method: HttpMethod;
    handler: RequestHandler;
    middlewares?: RequestHandler[];
}

export function Route(method: HttpMethod, path: string, ...middlewares: RequestHandler[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.routes) {
            target.routes = [];
        }

        target.routes.push({
            path,
            method,
            handler: descriptor.value,
            middlewares
        });

        return descriptor;
    };
}

export function Get(path: string, ...middlewares: RequestHandler[]) {
    return Route('get', path, ...middlewares);
}

export function Post(path: string, ...middlewares: RequestHandler[]) {
    return Route('post', path, ...middlewares);
}

export function Put(path: string, ...middlewares: RequestHandler[]) {
    return Route('put', path, ...middlewares);
}

export function Delete(path: string, ...middlewares: RequestHandler[]) {
    return Route('delete', path, ...middlewares);
}

export function Patch(path: string, ...middlewares: RequestHandler[]) {
    return Route('patch', path, ...middlewares);
} 