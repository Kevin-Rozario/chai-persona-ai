class ApiResponse<T> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T;
  public timestamp: string;

  constructor(statusCode: number, message: string, data: T) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export default ApiResponse;
