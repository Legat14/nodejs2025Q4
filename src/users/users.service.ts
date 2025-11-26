import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { store } from 'src/store';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    store.users.set(user.id, user);
    return user;
  }

  findAll() {
    return Array.from(store.users.values());
  }

  findOne(id: string) {
    const user = store.users.get(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = store.users.get(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(
        `The password for user #${id} does not match`,
      );
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = new Date().getTime();
    return user;
  }

  remove(id: string) {
    const isDeleted = store.users.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }
}
