/**
 * HTTP_STATUS contains the standard HTTP status codes used in the application.
 * Each status code is associated with a specific meaning regarding the outcome
 * of an HTTP request.
 */
export enum HTTP_STATUS {
  OK = 200, // Request succeeded
  CREATED = 201, // Resource created successfully
  BAD_REQUEST = 400, // Client sent an invalid request
  UNAUTHORIZED = 401, // Authentication is required and has failed
  FORBIDDEN = 403, // Server understands the request but refuses to authorize it
  NOT_FOUND = 404, // Requested resource could not be found
  INTERNAL_SERVER_ERROR = 500, // An error occurred on the server
  SUCCESS = 200, // General success status
  ERROR = 400, // General error status
  NOT_AUTHORIZED = 401, // User is not authorized to access the resource
} 