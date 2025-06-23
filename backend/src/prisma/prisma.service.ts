import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * PrismaService handles the database connection
 * OnModuleInit ensure the database connects when the module starts
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    /**
     * This method runs when the NestJS module is initialized
     * It establishes the connection to the database
    */
    async onModuleInit() {
        await this.$connect();
        console.log("✅ Connected to database successfully");
    }

    /**
     * This method runs when the NestJS module is destroyed
     * It disconnects the Prisma client from the database
     */
    async onModuleDestroy() {
        await this.$disconnect();
        console.log("❌ Disconnected from database successfully");
    }

}