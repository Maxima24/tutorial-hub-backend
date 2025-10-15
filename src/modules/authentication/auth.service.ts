import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptHelper } from 'src/utils/bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async register(data: { name: string; email: string; password: string }) {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new ConflictException('User already exists');
    const hashedPassword = await BcryptHelper.hashPassword(data.password);

    const user = await this.prisma.client.user.create({
      data: { email: data.email, password: hashedPassword, name: data.name },
    });
    const token = this.jwt.sign({ userId: user.id, email: user.email });
    return { user, token };
  }
  async login(data: { email: string; password: string }) {
    const { email } = data;
    const user = await this.prisma.client.user.findUnique({
      where: { email },
      omit:{
        createdAt:true,
        updatedAt:true
      }
    });
    if (!user) throw new ConflictException('Invalid credentials');
    const isMatch = await BcryptHelper.comparePassword(data.password, user.password);
    if (!isMatch) throw new ConflictException('Invalid credentials');
    const token = this.jwt.sign({ userId: user.id, email: user.email });
    const{password,...safeUser} = user
    return { safeUser, token };
  }
}
