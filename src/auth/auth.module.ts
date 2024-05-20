import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../database/schema/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import jwt_key from '../config/jwt_key'
import { UserService } from 'src/crud/user/user.service';
import { Columns } from 'src/database/schema/column.entity';
import { Comments } from 'src/database/schema/comment.entity';
import { Cards } from 'src/database/schema/card.entity';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwt_key().secretKey,
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Users, Columns, Cards, Comments]),
    
  ],
  controllers: [AuthController],
  exports: [JwtAuthService],
  providers: [JwtAuthService, UserService, JwtStrategy]
})
export class AuthModule {}