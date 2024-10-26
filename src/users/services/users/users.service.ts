import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile.enitity';
import { User } from 'src/typeorm/entities/User.entity';
import {
  CreateUserParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/users/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
  ) {}

  fetchUsers() {
    return this.userRepository.find();
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create(userDetails);
    this.userRepository.save(newUser);
  }

  updateUser(id: number, userDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...userDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserProfile(
    id: number,
    userProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const newProfile = this.userProfileRepository.create(userProfileDetails);
    const savedProfile = await this.userProfileRepository.save(newProfile);

    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
