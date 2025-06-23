import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JwtAuthGuard is a simple guard that user our JWT strategy
 * When you use @UseGuards(JwtAuthGuard) on a route:
 * 1. It checks if the requst has a valid JWT token
 * 2. If valid, it allows the request to continue
 * 3. If invalid or missing, it returns a 401 Unauthorized error
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }