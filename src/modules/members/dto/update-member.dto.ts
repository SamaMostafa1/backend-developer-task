import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class UpdateMemberDTO {
  @JoiSchema(
    Joi.string().trim().min(1).max(255).optional().messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.max': 'First name must be at most 255 characters',
    }),
  )
  firstName?: string;

  @JoiSchema(
    Joi.string().trim().min(1).max(255).optional().messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name cannot be empty',
      'string.max': 'Last name must be at most 255 characters',
    }),
  )
  lastName?: string;

  @JoiSchema(
    Joi.string().valid('male', 'female').optional().messages({
      'any.only': 'Gender must be male or female',
    }),
  )
  gender?: string;

  @JoiSchema(
    Joi.string().isoDate().optional().messages({
      'date.base': 'Date of birth must be a valid date',
      'date.less': 'Date of birth must be in the past',
    }),
  )
  dateOfBirth?: string;

  @JoiSchema(
    Joi.string()
      .trim()
      .pattern(/^\+?[1-9]\d{7,14}$/)
      .optional()
      .messages({
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid phone number',
      }),
  )
  phone?: string;
}
