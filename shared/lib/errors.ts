export class AppError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('unauthorized', message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super('not_found', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super('forbidden', message)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super('validation_error', message)
  }
}

/** Extracts a user-facing message from any thrown value */
export function toErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof Error) return err.message
  return fallback
}
