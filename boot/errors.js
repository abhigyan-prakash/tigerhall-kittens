export class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    }

    return 500;
  }
}

export class BadRequest extends GeneralError {}
export class NotFound extends GeneralError {}
