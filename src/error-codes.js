class ErrorCodes {
  constructor(name) {
    this.name = name;
  }
  toString() {
    return `${this.name}`;
  }
}

ErrorCodes.RESOURCE_NOT_FOUND = new ErrorCodes('RESOURCE_NOT_FOUND');
ErrorCodes.FAILED_VALIDATION = new ErrorCodes('FAILED_VALIDATION');
ErrorCodes.RESOURCE_EXISTS = new ErrorCodes('RESOURCE_EXISTS');
ErrorCodes.PROXY_ERROR = new ErrorCodes('PROXY_ERROR');
ErrorCodes.UNAUTHORIZED = new ErrorCodes('UNAUTHORIZED');
ErrorCodes.FORBIDDEN = new ErrorCodes('FORBIDDEN');
ErrorCodes.INTERNAL_SERVER_ERROR = new ErrorCodes('INTERNAL_SERVER_ERROR');
ErrorCodes.REQUEST_LIMIT_REACHED = new ErrorCodes('REQUEST_LIMIT_REACHED');

module.exports = ErrorCodes;
