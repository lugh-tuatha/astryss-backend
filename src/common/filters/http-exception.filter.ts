import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[] = "Unexpected error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      message = (typeof errorResponse === 'object' && errorResponse !== null && (errorResponse as any).message)
        ? (errorResponse as any).message
        : errorResponse;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    })
  }
}
