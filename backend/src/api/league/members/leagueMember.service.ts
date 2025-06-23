import { Injectable, NotFoundException } from "@nestjs/common";
import { LeagueRole } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class LeagueMemberService {
    constructor(private prisma: PrismaService) { }

    /**
     * This method retrieves all members (owner, admins and members) of a specific league.
     * @param leagueId 
     * returns an object containing owner, adminsm and members of the league.
     */
    async getLeagueMembers(leagueId: string) {
        const leagueMembers = await this.prisma.leagueMember.findMany({
            where: {
                leagueId: leagueId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            }
        });

        if (!leagueMembers || leagueMembers.length === 0) {
            throw new NotFoundException("No members found for this league");
        }

        const members = {
            owner: leagueMembers.filter(member => member.role === LeagueRole.OWNER)[0],
            admins: leagueMembers.filter(member => member.role === LeagueRole.ADMIN),
            members: leagueMembers.filter(member => member.role === LeagueRole.MEMBER),
        };

        return members;

    };

    /**
     * This function retrieves a specific league member by their userId and leagueId.
     * @param leagueId the id of the league
     * @param userId the id of the user
     * @returns the league member object containing user details
     * @throws NotFoundException if the league member is not found - aka userId is not a member of the league
     */
    async getLeagueMember(leagueId: string, userId: string) {
        const leagueMember = await this.prisma.leagueMember.findFirst({
            where: {
                leagueId: leagueId,
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            }
        });

        if (!leagueMember) {
            throw new NotFoundException("League member not found");
        }

        return leagueMember;
    }

}