import { AppError } from "../errors/AppError";

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const handleError = (
  error: unknown
): { message: string; statusCode: number } => {
  if (isError(error)) {
    if (error instanceof AppError) {
      return { message: error.message, statusCode: error.statusCode };
    } else {
      return { message: error.message, statusCode: 500 };
    }
  } else {
    return { message: "An unknown error occurred", statusCode: 500 };
  }
};
