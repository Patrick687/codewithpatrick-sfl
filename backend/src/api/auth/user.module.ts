import { Module } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * UserModule handles user-related functionality
 * It provides UserService and makes it available to other modules
 */
@Module({
    providers: [UserService],
    exports: [UserService], // Export so AuthModule can use it
})
export class UserModule { }