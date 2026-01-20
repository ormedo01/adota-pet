import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      password_hash: passwordHash,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, user_type } = loginDto;

    // Find user by email and type
    const user = await this.usersService.findByEmailAndType(email, user_type);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      access_token: token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    return this.sanitizeUser(user);
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      type: user.user_type,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
