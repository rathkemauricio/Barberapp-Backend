import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import { UserController } from './controllers/UserController';
import { CustomerController } from './controllers/CustomerController';
import { AppointmentController } from './controllers/AppointmentController';
import { FidelityController } from './controllers/FidelityController';
import { ServiceController } from './controllers/ServiceController';
import { AvailabilityController } from './controllers/AvailabilityController';
import fileUpload from 'express-fileupload';

const app = express();

// Middlewares
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
    // console.log('=== Request Debug ===');
    // console.log('Method:', req.method);
    // console.log('URL:', req.url);
    // console.log('Headers:', req.headers);
    // console.log('Body:', req.body);
    // console.log('===================');
    next();
});

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },//No maximo 50mb
}));

// Initialize controllers
const controllers = [
    new UserController(),
    new CustomerController(),
    new AppointmentController(),
    new FidelityController(),
    new ServiceController(),
    new AvailabilityController()
];

controllers.forEach(controller => app.use(controller.router));

app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp'))
)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof Error) {
        res.status(400).json({
            error: err.message
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    });
}

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log('Servidor online!!!!'))