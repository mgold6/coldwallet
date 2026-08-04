import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 403);

    this.name = "UnauthorizedError";
  }
}