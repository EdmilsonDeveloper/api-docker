import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserResponse } from '../user/user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ){}

  async create(userData: CreateUserDto): Promise<CreateUserResponse> {
    const userAlreadyRegistered = await this.findByUsername(userData.username)

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${userData.username}' already registered`,
      );
    }

    const createdUser = {
      username: userData.username,
      password: bcryptHashSync(userData.password, 10),
    }
    console.log(createdUser.password)

    const { id, username} = await this.userModel.create(createdUser)
    return { id, username }
  }

  async findByUsername(username: string): Promise<CreateUserDto | null> {
    const foundUser = await this.userModel.findOne({where: {username}})

    if (!foundUser) {
        return null;
    }

    return{
      id: foundUser.id,
      username: foundUser.username,
      password: foundUser.password,
    }
  }

  async findOne(id: string): Promise<CreateUserDto> {
    const foundUser =  await this.userModel.findOne({where: {id}})

    if (!foundUser) {
      throw new HttpException(
        `User with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.mapModelToDto(foundUser)
  }

  async delete(id: string) {
    const result = await this.userModel.destroy({where: {id}})

    if (!result) {
      throw new HttpException(
        `User with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapModelToDto(user: User): CreateUserDto{
    return  {
      id: user.id,
      username: user.username,
      password: user.password,
    }
  }
}
