import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class updateProductDTO {
  @JoiSchema(
    Joi.string().uuid().optional().messages({
      'string.base': 'Shop ID must be a  UUID string',
      'string.empty': 'Shop ID cannot be empty',
    }),
  )
  shopId?: string;
  @JoiSchema(
    Joi.string().trim().min(3).max(5000).optional().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be at most 5000 characters',
    }),
  )
  name?: string;
  @JoiSchema(
    Joi.string().optional().max(10000).messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must be at most 10000 characters',
    }),
  )
  description?: string;
  @JoiSchema(
    Joi.number().positive().optional().messages({
      'number.base': 'Price must be a number',
      'number.empty': 'Price cannot be empty',
      'number.positive': 'Price must be a positive number',
    }),
  )
  price?: number;
  @JoiSchema(
    Joi.number().integer().min(1).positive().optional().messages({
      'number.base': 'Stock count must be a number',
      'number.empty': 'Stock count cannot be empty',
      'number.integer': 'Stock count must be an integer',
      'number.min': 'Stock count must be at least 1',
      'number.positive': 'Stock count must be a positive number',
    }),
  )
  stockCount?: number;
}
