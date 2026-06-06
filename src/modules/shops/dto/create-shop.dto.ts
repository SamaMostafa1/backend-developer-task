import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

const AVAILABILITY = ['busy', 'open', 'closed'];

export class CreateShopDTO {
  @JoiSchema(Joi.string().trim().min(1).max(250).required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character',
      'string.max': 'Name must be at most 250 characters',
      'any.required': 'Name is required',
    })
  )
  name: string;

  @JoiSchema(Joi.date().iso().required()
    .messages({
      'date.base': 'Opening hour must be a date',
      'date.empty': 'Opening hour cannot be empty',
      'any.required': 'Opening hour is required',
    })
  )
  openingHour: Date;
// ASSUMPTION: closingHour must be strictly after openingHour.
// This is enforced to prevent invalid data where a shop could have a closing hour before its opening hour, which would not make sense in a real-world scenario.
  @JoiSchema(Joi.date().iso().greater(Joi.ref('openingHour')).required()
    .messages({
      'date.base': 'Closing hour must be a date',
      'date.empty': 'Closing hour cannot be empty',
      'any.required': 'Closing hour is required',
      'date.greater': 'Closing hour must be greater than opening hour',
    })
  )
  closingHour: Date;

  @JoiSchema(
    Joi.string()
      .valid(...AVAILABILITY)
      .required()
      .messages({
        'string.base': 'Availability must be a valid option (open, closed, busy)',
        'any.required': 'Availability is required',
      })
  )
  availability: string;
}
