import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}
 /*
  async register(newUser: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(newUser);
    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<User | null> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;
    // Add password verification logic here
    return user;
  }*/
  async register(newUser: CreateUserDto): Promise<UserEntity> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    const user = this.userRepository.create({
      username: newUser.username,
      password: hashedPassword,
      salt: salt,
      email: newUser.email,
      role: newUser.role,
    });

    return await this.userRepository.save(user);
  }
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await user.validatePassword(password)) {
      return user;
    }
    return null;
  }
}
