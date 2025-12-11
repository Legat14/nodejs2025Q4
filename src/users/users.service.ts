import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const date = Date.now();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user: User = this.usersRepo.create({
      id: uuidv4(),
      login,
      password: hash,
      createdAt: date,
      updatedAt: date,
      version: 1,
    });

    try {
      return await this.usersRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create new user');
    }
  }

  async findAll() {
    return await this.usersRepo.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(id);
    const isMatch = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new ForbiddenException(
        `The password for user #${id} does not match`,
      );
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, salt);
    user.version += 1;
    user.updatedAt = Date.now();
    await this.usersRepo.save(user);
    return user;
  }

  async remove(id: string) {
    const result = await this.usersRepo.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }
}
