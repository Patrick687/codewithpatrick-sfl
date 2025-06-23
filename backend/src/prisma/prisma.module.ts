import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule provides the database service
 * @Global() makes this module available throughout the entire application
 * without needing to import it in every module that needs database access
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Make PrismaService available to other modules
})
export class PrismaModule { }