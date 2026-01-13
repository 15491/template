import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs'

// 将bigint转换为字符串，并保留日期类型不变
function transformBigInt(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  if (Array.isArray(value)) {
    return value.map(transformBigInt)
  }
  if (value !== null && typeof value === 'object') {
    if (value instanceof Date) {
      return value
    }
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
        key,
        transformBigInt(entryValue),
      ]),
    )
  }
  return value
}

interface ResponseData {
  message?: string
  code?: number
  data?: unknown
}

@Injectable()
export class InterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    return next.handle().pipe(
      map((data: ResponseData) => {
        const message
          = data?.message !== undefined && data.message !== null ? String(data.message) : '请求成功'
        const code = data?.code !== undefined && data.code !== null ? Number(data.code) : 200
        const responseData = data?.data !== undefined ? data.data : null

        return {
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
          code,
          success: true,
          data: transformBigInt(responseData) ?? null,
        }
      }),
    )
  }
}
