import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post.entity';
import { Profile } from 'src/typeorm/entities/Profile.enitity';
import { User } from 'src/typeorm/entities/User.entity';
import {
  CreateUserParams,
  CreateUserPostParams,
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
    @InjectRepository(Post) private userPostRespository: Repository<Post>,
  ) {}

  fetchUsers() {
    return this.userRepository.find({ relations: ['profile', 'posts'] });
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

  async createUserPost(id: number, userPostDetails: CreateUserPostParams) {
    const user = await this.userRepository.findOneBy({ id });

    const newPost = this.userPostRespository.create({
      ...userPostDetails,
      user,
    });
    return await this.userPostRespository.save(newPost);
  }
}
