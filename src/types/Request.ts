import { Request as ExpressRequest } from 'express';

export type Request<T> = ExpressRequest & { body: T }; 