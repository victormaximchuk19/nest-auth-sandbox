import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Public } from 'src/decorators/public-route.decorator';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/sign-up')
  @Public()
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('/sign-in')
  @Public()
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body);
  }

  @Post('/refresh')
  @Public()
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refreshSession(token);
  }

  @Get()
  index(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get('/:id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({ id });
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
