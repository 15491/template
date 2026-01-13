import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Catch, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class InterceptorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    response.status(exception.getStatus()).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      code: exception.getStatus(),
      success: false,
    })
  }
}
