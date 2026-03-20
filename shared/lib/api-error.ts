import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown }
}

export function apiError(code: string, message: string, status: number) {
  return NextResponse.json<ApiErrorBody>({ error: { code, message } }, { status })
}

export function apiValidationError(err: ZodError) {
  return NextResponse.json<ApiErrorBody>(
    { error: { code: 'validation_error', message: 'Validation failed', details: err.flatten() } },
    { status: 422 }
  )
}

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 403
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super('not_found', message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('unauthorized', message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super('forbidden', message, 403)
  }
}
