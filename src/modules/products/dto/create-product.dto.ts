import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateProductDTO {
  @JoiSchema(
    Joi.string().uuid().required().messages({
      'string.base': 'Shop ID must be a  UUID string',
      'string.empty': 'Shop ID cannot be empty',
      'string.uuid': 'Shop ID must be a validID',
      'any.required': 'Shop ID is required',
    }),
  )
  shopId: string;

  @JoiSchema(
    Joi.string().trim().min(3).max(1000).required().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be at most 1000 characters',
      'any.required': 'Name is required',
    }),
  )
  name: string;
  @JoiSchema(
    Joi.string().required().max(5000).messages({
      'string.base': 'Description must be a string',
      'any.required': 'Description is required',
      'string.max': 'Description must be at most 5000 characters',
    }),
  )
  description: string;
  @JoiSchema(
    Joi.number()
      .positive()

      .required()
      .messages({
        'number.base': 'Price must be a number',
        'number.empty': 'Price cannot be empty',
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
      }),
  )
  price: number;
  @JoiSchema(
    Joi.number().integer().min(1).positive().required().messages({
    'any.required': 'Stock count is required',
      'number.base': 'Stock count must be a number',
      'number.empty': 'Stock count cannot be empty',
      'number.integer': 'Stock count must be an integer',
      'number.min': 'Stock count must be at least 1',
      'number.positive': 'Stock count must be a positive number',
    }),
  )
  stockCount: number;
}
