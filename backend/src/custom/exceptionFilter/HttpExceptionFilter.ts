import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    private formatError(error: any): string {
        if (error instanceof Error) {
            return `${error.name}: ${error.message}`;
        }
        return JSON.stringify(error, null, 2);
    }

    private logError(level: 'warn' | 'error', title: string, request: Request, exception: any) {
        const separator = '='.repeat(50);

        console.log(`\n${separator}`);
        console.log(`🚨 ${title}`);
        console.log(separator);
        console.log(`📍 ${request.method} ${request.url}`);
        console.log(`⏰ ${new Date().toISOString()}`);

        if (Object.keys(request.body || {}).length > 0) {
            console.log(`📝 Body:`, JSON.stringify(request.body, null, 2));
        }

        if (Object.keys(request.params || {}).length > 0) {
            console.log(`🔗 Params:`, request.params);
        }

        if (Object.keys(request.query || {}).length > 0) {
            console.log(`❓ Query:`, request.query);
        }

        console.log(`💥 Error:`, this.formatError(exception));

        if (exception instanceof Error && exception.stack) {
            console.log(`📚 Stack Trace:`);
            console.log(exception.stack);
        }

        console.log(separator + '\n');
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: string | object;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse;

            this.logError('warn', `HTTP Exception (${status})`, request, exception);
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';

            this.logError('error', 'Unexpected Error', request, exception);
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
        };

        response.status(status).json(errorResponse);
    }
}