import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { LeagueController } from "./league.controller";
import { LeagueService } from "./league.service";
import { LeagueMemberService } from "./members/leagueMember.service";

/**
 * LeagueModule handles all league-related functionality including:
 * - League CRUD operations
 * - League member management
 * - League-related business logic
 */
@Module({
    controllers: [LeagueController],
    providers: [
        LeagueService,
        LeagueMemberService,
        PrismaService
    ],
    exports: [
        LeagueService,
        LeagueMemberService
    ]
})
export class LeagueModule { }