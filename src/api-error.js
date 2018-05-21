class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

module.exports = class ApiError extends ExtendableError {
  constructor(m, code = 'UNKNOWN', statusCode = 500, source = null, moreInfo = null) {
    super(m);
    this.id = null;
    this.code = code.toString();
    this.statusCode = statusCode;
    this.source = source;
    this.moreInfo = moreInfo;
  }
};
