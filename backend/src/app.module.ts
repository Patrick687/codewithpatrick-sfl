import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/auth/user.module';
import { LeagueModule } from './api/league/league.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * AppModule is the root module of the application
 * It imports all other modules and ties everything together
 */
@Module({
    imports: [
        PrismaModule,  // Database connection
        AuthModule,    // Authentication functionality
        UserModule,    // User management
        LeagueModule, // League management
    ],
})
export class AppModule { }