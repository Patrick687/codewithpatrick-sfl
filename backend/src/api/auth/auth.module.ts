import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from './user.module';

/**
 * AuthModule handles all authentication functionality
 * It imports the necessary modules and provides auth services
 */
@Module({
    imports: [
        UserModule, // Import UserModule to access UserService
        PassportModule, // Import PassportModule for authentication strategies
        JwtModule.register({
            // JWT configuration
            secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
            signOptions: {
                expiresIn: '24h' // Tokens expire after 24 hours
            },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService], // Export AuthService in case other modules need it
})
export class AuthModule { }