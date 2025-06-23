import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./auth.dto";
import { JwtAuthGuard } from "./jwt.auth.guard";

/**
 * AuthController handles all authentication-related HTTP requests
 * Routes in this controller will be prefixed with '/auth'
 */
@Controller('auth')
export class AuthController {

    /**
     * @param authService - Inject the AuthService to handle business logic
     */
    constructor(private authService: AuthService) { }

    /**
     * Handle user registration
     * POST /auth/signup
     * @param signupDto - Validated signup data from request body
     */
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signupDto: SignupDto) {
        return await this.authService.signup(signupDto);
    }

    /**
     * Handle user login
     * POST /auth/login
     * @param loginDto - Validated login data from request body
     */
    @Post('login')
    @HttpCode(HttpStatus.OK) // Return 200 OK status
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    /**
     * Get current user's profile
     * GET /auth/profile
     * This route is protected - requires valid JWT token
     * @param req - Request object (contains user info from JWT)
     */
    @UseGuards(JwtAuthGuard) // This decorator protects the route
    @Get('profile')
    getProfile(@Request() req) {
        // req.user is populated by the JWT strategy
        return {
            message: 'Profile retrieved successfully',
            user: req.user
        };
    }
}