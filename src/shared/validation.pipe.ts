import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly schema?: any) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    let object: any = value;
    if (!this.schema) {
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      object = plainToClass(metatype, value);
    } else {
      object = plainToClass(this.schema, value);
    }
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages = [];
      errors.forEach((e) => {
        const error = e.constraints ? e : this.getError(e);
        const keys = Object.keys(error.constraints);
        keys.forEach((k) => {
          const message = {};
          message[error.property + '.' + k] = error.constraints[k];
          messages.push(message);
        });
      });
      throw new BadRequestException(messages, 'Validation failed');
    }
    return object;
  }

  private getError(error: any) {
    if (error.constraints) {
      return error;
    }
    return this.getError(error.children[0]);
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
