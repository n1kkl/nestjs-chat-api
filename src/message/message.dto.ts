import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @MaxLength(2048, { message: 'Message must be less than 2048 characters long.' })
  @MinLength(1, { message: 'Message must be at least 1 character long.' })
  @IsString({ message: 'Message is required.' })
  content: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
}
