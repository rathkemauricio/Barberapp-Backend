import { Request as ExpressRequest, Response } from 'express';

export function Request<T extends object>(dto: new () => T) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: ExpressRequest, res: Response) {
            const dtoInstance = new dto();
            Object.assign(dtoInstance, req.body);
            return originalMethod.call(this, dtoInstance, res);
        };

        return descriptor;
    };
} 