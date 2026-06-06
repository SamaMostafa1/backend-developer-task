import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateMemberDTO {
   @JoiSchema(
    Joi.string().trim().min(1).max(255).required().messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'any.required': 'First name is required',
    }),
  )
  firstName: string;
   @JoiSchema(
    Joi.string().trim().min(1).max(255).required().messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name cannot be empty',
      'any.required': 'Last name is required',
    }),
  )
  lastName: string;

  @JoiSchema(
    Joi.string().valid('male', 'female').required().messages({
      'any.only': 'Gender must be male or female',
      'any.required': 'Gender is required',
    }),
  )
  gender: string;

   @JoiSchema(
    Joi.string().isoDate().required().messages({
      'date.base': 'Date of birth must be a valid date',
      'date.less': 'Date of birth must be in the past',
      'any.required': 'Date of birth is required',
    }),
  )
  dateOfBirth: string;

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

  @JoiSchema(
    Joi.string().uuid().optional().messages({
      'string.guid': 'Central member ID must be a valid UUID',
    }),
  )
  centralMemberId?: string;
}
