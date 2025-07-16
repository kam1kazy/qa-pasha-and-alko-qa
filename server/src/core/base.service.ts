import { AppError } from './error.handler.js';

export abstract class BaseService {
  protected throwIf(condition: boolean, message: string, code = 400) {
    if (condition) {
      throw new AppError(message, code);
    }
  }
}
