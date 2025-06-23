/**
 * AuthService handles the business logic for authentication.
 * This includes user registration, login, and JWT token generation.
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
    /**
     * Inject the services we need:
     * - UserService for database operations
     * - JwtService for creating JWT tokens
     */
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    /**
     * Handle user registration
     * @param signupDto - contains email, username and password
     * @returns User information and JWT token
     */
    async signup(signupDto: SignupDto) {
        const { email, username, password } = signupDto;

        //Creat the user in the database
        const user = await this.userService.createUser(email, username, password);

        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            token: token,
        };
    }

    /**
     * Handle user login
     * @param loginDto - Contains identifier (email or username) and password
     * @returns User information and JWT token
     */
    async login(loginDto: LoginDto) {
        const { identifier, password } = loginDto;

        //Find the user by email or username
        const user = await this.userService.findByEmailOrUsername(identifier);

        if (!user) {
            throw new UnauthorizedException('Invalid email/username or password');
        }

        const isPasswordValid = await this.userService.validatePassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email/username or password');
        }

        //Create JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            token: token,
        };
    }

}
