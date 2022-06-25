import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class PrivateUser {
  id: string;
  username: string;
  email: string;
  firstname: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  authId: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class PublicUser extends PrivateUser {
  @Exclude()
  email: string;
}