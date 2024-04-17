import { UserService } from './users.service';
import { Controller, Get, Logger, Query, UsePipes } from '@nestjs/common';
import { UsersResponseDto } from './dto/users.response.dto';
import { UsersRequestParamsDto } from './dto/users.request.dto';
import { ZodPipe } from 'src/zod/zod-validation.pipe';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  @UsePipes(new ZodPipe(UsersRequestParamsDto))
  async getAllUsers(@Query() params: UsersRequestParamsDto) {
    this.logger.log(
      `Get all users, limit: ${params.limit}, page: ${params.page}, sortBy: ${params.sort_by}, sortOrder: ${params.sort_order}`,
    );
    const response = await this.userService.findAll(params);
    return {
      users: response[0].map((user) => UsersResponseDto.fromUsersEntity(user)),
      count: response[1],
    };
  }
}
