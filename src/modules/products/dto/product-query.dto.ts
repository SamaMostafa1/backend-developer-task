import * as Joi from 'joi';
import { JoiSchema } from "nestjs-joi";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class ProductQueryDto extends PaginationDto {
  @JoiSchema(
    Joi.string().trim().max(250).optional().messages({
      'string.base': 'Search must be a string',
      'string.max': 'Search must be at most 250 characters',
    }),
  )
  search?: string;
}