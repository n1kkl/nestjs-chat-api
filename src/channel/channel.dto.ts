import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateChannelDto {
  @MaxLength(64, { message: 'Title must be less than 64 characters long.' })
  @MinLength(4, { message: 'Title must be at least 4 characters long.' })
  @Matches(/^[a-zA-Z\d \-_.]+$/g, { message: 'Title contains invalid characters.' })
  @IsString({ message: 'Title is required.' })
  title: string;

  @MaxLength(1024, { message: 'Title must be less than 1024 characters long.' })
  @MinLength(4, { message: 'Title must be at least 4 characters long.' })
  @IsOptional()
  description?: string;
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
}
