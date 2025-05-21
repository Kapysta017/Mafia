import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/entities';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Player> {
    const { username, email, password } = createUserDto;

    try {
      const passwordHash: string = await bcrypt.hash(password, 10);

      const newPlayer = this.playerRepository.create({
        username,
        email,
        passwordHash,
      });

      return await this.playerRepository.save(newPlayer);
    } catch (error) {
      console.error('Registration failed:', error);

      throw new Error('Failed to register user');
    }
  }
}
