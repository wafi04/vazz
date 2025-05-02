// src/lib/trpc-response.ts
import { TRPCError } from "@trpc/server";

/**
 * Standard success response structure
 */
export interface SuccessResponse<T> {
  status: "success";
  data: T;
  message?: string;
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  status: "error";
  message: string;
  code: string;
}

/**
 * Creates a standardized success response
 * @param data The data to return
 * @param message Optional success message
 */
export function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    status: "success",
    data,
    message
  };
}

/**
 * Creates a standardized error response
 * @param message Error message
 * @param code Error code
 */
export function createErrorResponse(message: string, code: string): ErrorResponse {
  return {
    status: "error",
    message,
    code
  };
}

/**
 * Handles database operations with proper error handling
 * @param operation Database operation function
 * @param errorMessage Error message if operation fails
 */
export async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = "Database operation failed"
): Promise<T> {
  try {
    const result = await operation();
    
    // Handle empty results that should return a "not found" error
    if (result === null || result === undefined) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Requested resource not found"
      });
    }
    
    return result;
  } catch (error) {
    // If it's already a TRPCError, just re-throw it
    if (error instanceof TRPCError) {
      throw error;
    }
    
    // Log error safely for server-side debugging
    // This could be replaced with proper server logging like winston/pino
    console.error("[Database Error]", error);
    
    // Return standardized error
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      cause: error
    });
  }
}

/**
 * Formats a tRPC response with consistent structure
 * @param data Data to return in response
 * @param message Optional success message
 */
export function formatResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return createSuccessResponse(data, message);
}

/**
 * Validates the existence of a resource and throws appropriate error if not found
 * @param resource Resource to check
 * @param resourceName Name of the resource for error message
 * @param identifier Identifier used to look up the resource
 */
export function validateResourceExists<T>(
  resource: T | null | undefined,
  resourceName: string,
  identifier: string | number
): T {
  if (!resource) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `${resourceName} with identifier ${identifier} not found`
    });
  }
  return resource;
}