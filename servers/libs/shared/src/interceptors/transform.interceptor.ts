import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

// 将bigint转换为字符串，并保留日期类型不变
const transformBigInt = (value: unknown): unknown => {
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

@Injectable()
export class InterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    return next.handle().pipe(
      map((data) => {
        return {
          timestamp: new Date().toISOString(),
          path: request.url,
          message: data?.message || '请求成功',
          code: data?.code || 200,
          success: true,
          data: transformBigInt(data?.data) ?? null,
        }
      }),
    )
  }
}
