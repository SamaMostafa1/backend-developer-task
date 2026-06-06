import * as Joi from 'joi';
import { JoiSchema } from "nestjs-joi";

export class UpdateShopDTO {
  @JoiSchema( 
    Joi.string().trim().min(1).max(250).optional().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character',
      'string.max': 'Name must be at most 250 characters',
    })
  )
  name?: string;
  @JoiSchema(
    Joi.date().iso().less(Joi.ref('closingHour')).optional().messages({
      'date.base': 'Opening hour must be a date',
      'date.empty': 'Opening hour cannot be empty',
    })
  )
  openingHour?: Date;
  @JoiSchema(
    Joi.date().iso().greater(Joi.ref('openingHour')).optional().messages({
      'date.base': 'Closing hour must be a date',
      'date.empty': 'Closing hour cannot be empty',
    })
  )
  closingHour?: Date;
  availability?: string;
}
