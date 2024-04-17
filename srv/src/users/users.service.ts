import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UsersRequestParamsDto } from './dto/users.request.dto';

@Injectable()
export class UserService {
  // private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll({
    limit = 20,
    page = 1,
    sort_by = 'id',
    sort_order = 'asc',
  }: UsersRequestParamsDto): Promise<[UsersEntity[], number]> {
    const skip = limit * (page - 1);
    return await this.usersRepo.findAndCount({
      skip,
      take: limit,
      order: {
        [sort_by]: sort_order,
      },
    });
  }
}
