import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LeagueRole, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLeagueDto } from "./dto/createLeagueDto";
import { UpdateLeagueDto } from "./dto/updateLeagueDto";
import { LeagueMemberService } from "./members/leagueMember.service";

/**
 * LeagueService handles all league-related business logic.
 */
@Injectable()
export class LeagueService {
    constructor(private prisma: PrismaService, private leagueMemberService: LeagueMemberService) { }

    /**
     * This method creates a new league as well as the initial league member for the user creating the league
     * @param user User who is creating the league
     * @param createLeagueDto Data Transfer Object containing league creation details
     */
    async createLeague(user: User, createLeagueDto: CreateLeagueDto) {
        const createdLeague = await this.prisma.league.create({
            data: {
                name: createLeagueDto.name,
                description: createLeagueDto.description,
            }
        });

        const createdOwner = await this.prisma.leagueMember.create({
            data: {
                userId: user.id,
                leagueId: createdLeague.id,
                role: LeagueRole.OWNER,
            }
        });

        return await this.getLeague(user, createdLeague.id);
    }

    async updateLeagueInfo(user: User, leagueId: string, updateData: Partial<UpdateLeagueDto>) {
        const league = await this.getLeague(user, leagueId);

        //Update the league information if name and/or description are provided in the updateData
        await this.prisma.league.update({
            where: { id: leagueId },
            data: {
                name: updateData.name ?? league.name,
                description: updateData.description ?? league.description,
            },
        });

        const updatedLeague = await this.getLeague(user, league.id);

        return updatedLeague;
    };

    /**
     * This method retrieves all leagues that the user is a member of.
     * It returns an array of leagues that the user is associated with.
     * @param user requesting for leagues
     * @returns an array of leagues the user is a member of and a success message
     */
    async getLeagues(user: User) {
        const leaguesData = await this.prisma.league.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
        });
        const leagues = [];

        for (const league of leaguesData) {
            const leagueMembers = await this.leagueMemberService.getLeagueMembers(league.id);
            leagues.push({
                id: league.id,
                name: league.name,
                description: league.description,
                createdAt: league.createdAt,
                updatedAt: league.updatedAt,
                members: leagueMembers,
            });
        }

        return leagues;
    }

    /**
     * This methods retrieves a specific league by its ID.
     * @param user requesting for league 
     * @param leagueId id of the league to retrieve
     * @throws NotFoundException if the league does not exist
     * @throws UnauthorizedException if the user is not in the league
     * @returns the league details if found and a success message
     */
    async getLeague(user: User, leagueId: string) {
        const league = await this.prisma.league.findUnique({
            where: { id: leagueId },
        });

        if (!league) {
            throw new NotFoundException(`League with ID ${leagueId} not found`);
        }

        await this.leagueMemberService.getLeagueMember(league.id, user.id);

        const leagueMembers = await this.leagueMemberService.getLeagueMembers(league.id);

        return {
            id: league.id,
            name: league.name,
            description: league.description,
            createdAt: league.createdAt,
            updatedAt: league.updatedAt,
            members: leagueMembers,
        };

    }

    /**
     * This method deletes a specific league by its ID.
     * @param user requesting for league deletion
     * @param leagueId id of the league to delete
     * @throws NotFoundException if the league does not exist
     * @throws UnauthorizedException if the user is not the owner of the league
     * @returns a success message if the league is deleted successfully
     */
    async deleteLeague(user: User, leagueId: string): Promise<void> {
        const league = await this.getLeague(user, leagueId);

        const leagueOwner = await this.leagueMemberService.getLeagueMember(leagueId, user.id);
        if (leagueOwner.role !== LeagueRole.OWNER) {
            throw new UnauthorizedException("Only the league owner can delete the league");
        }

        try {
            await this.prisma.league.delete({
                where: { id: leagueId },
            });
        } catch (error) {
            console.error(`Error deleting league with ID ${leagueId}:`, error);
            throw error;
        }
    }
}