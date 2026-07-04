class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.getErrorCodeByStatus(statusCode);
  }

  private getErrorCodeByStatus(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return "BAD_REQUEST";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 429:
        return "TOO_MANY_REQUESTS";
      case 500:
        return "INTERNAL_SERVER_ERROR";
      default:
        return "UNKNOWN_ERROR";
    }
  }
}

export default ApiError;
