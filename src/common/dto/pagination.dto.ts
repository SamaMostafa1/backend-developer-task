import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class PaginationDto {
  @JoiSchema(
    Joi.number().integer().min(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be greater than or equal to 1',
    }),
  )
  page?: number = 1;

  @JoiSchema(
    Joi.number().integer().min(1).max(100).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be greater than or equal to 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  )
  limit?: number = 20;
}