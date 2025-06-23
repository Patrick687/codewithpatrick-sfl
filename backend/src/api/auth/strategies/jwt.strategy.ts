import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user.service";

/**
 * JwtStrategy defines how to validate JWT token
 * When a user sends a request with a JWT token, this strategy:
 * 1. Extracts the token from the Authorization header
 * 2. Verifies the token is valid and not expired
 * 3. Gets the user infromation from the database
 * 4. Attaches the user to the request object
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
        super({
            //Extract JWT from the Authorization header as a Bearer token
            //Format: "Authroization: Bearer <token>"
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            //Don't ignore expired tokens - they should be rejected
            ignoreExpiration: false,

            //Secret key used to verify the token
            secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
        });
    }

    /**
     * 
     * This method is called after the JWT token is successfully verified.
     * The 'payload' contains the data we put in the token when we created it
     * @param payload - the decoded JWT payload
     * @returns The user object that will be attached to the request
     */
    async validate(payload: any) {
        const user = await this.userService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
        };
    }

}