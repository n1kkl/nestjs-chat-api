import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<Request>().user;
  }
);