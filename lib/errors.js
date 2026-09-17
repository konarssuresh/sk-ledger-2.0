class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized: Invalid token") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden: Invalid internal key") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

function toErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: { error: error.message },
    };
  }

  return {
    status: 500,
    body: { error: error.message || "Internal server error" },
  };
}

module.exports = {
  AppError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  toErrorResponse,
};
