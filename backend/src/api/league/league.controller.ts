
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { CreateLeagueDto } from "./dto/createLeagueDto";
import { LeagueParamsDto } from "./dto/leagueParamsDto";
import { UpdateLeagueDto } from "./dto/updateLeagueDto";
import { LeagueService } from "./league.service";
/**
 * leagueController handles all League CRUD-related HTTP requests
 * Routes in this controller will be prefixed with '/league'
 */
@Controller('league')
export class LeagueController {
    constructor(private leagueService: LeagueService) { }

    /**
     * Create a new league
     * POST /league
     * This route is protected - requires valid JWT token
     * This method creates a new league and the initial league member for the user creating the league
     * @param user - The user creating the league, extracted from the JWT token
     * @param createLeagueDto - Data Transfer Object containing league creation details
     * @returns a success message and the created league object
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createLeague(
        @GetUser() user: User,
        @Body() createLeagueDto: CreateLeagueDto) {
        const league = await this.leagueService.createLeague(user, createLeagueDto);
        return {
            message: 'League created successfully',
            league: league
        };
    };

    /**
     * Get all leagues for the authenticated user
     * GET /league
     * This route is protected - requires valid JWT token
     * @param user - The user requesting the leagues, extracted from the JWT token
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllLeagues(@GetUser() user: User) {
        const leagues = await this.leagueService.getLeagues(user);
        return {
            message: 'Leagues retrieved successfully',
            leagues: leagues
        };
    }

    /**
     * Get a league by its ID
     * GET /league/:leagueId
     * This route is protected - requires valid JWT token
     * @param user - The user requesting the league, extracted from the JWT token
     * @param leagueId - The ID of the league to retrieve
     */
    @UseGuards(JwtAuthGuard)
    @Get(':leagueId')
    @HttpCode(HttpStatus.OK)
    async getLeagueById(
        @GetUser() user: User,
        @Param() leagueParamsDto: LeagueParamsDto,
    ) {
        const league = await this.leagueService.getLeague(user, leagueParamsDto.leagueId);
        return {
            message: 'League retrieved successfully',
            league: league
        };
    }

    /**
     * Update league information
     * PUT /league/:leagueId
     * This route is protected - requires valid JWT token
     * @param user - The user updating the league, extracted from the JWT token
     * @param leagueId - The ID of the league to update
     * @param updateData - Partial data to update the league (name and/or description)
     * @returns a success message and the updated league object
     */
    @UseGuards(JwtAuthGuard)
    @Put(':leagueId')
    @HttpCode(HttpStatus.OK)
    async updateLeagueInfo(
        @GetUser() user: User,
        @Param() leagueParamsDto: LeagueParamsDto,
        @Body() updateLeagueDto: UpdateLeagueDto,
    ) {
        const updatedLeague = await this.leagueService.updateLeagueInfo(user, leagueParamsDto.leagueId, updateLeagueDto);
        return {
            message: 'League updated successfully',
            league: updatedLeague
        };
    }

    /**
     * Delete a league by its ID
     * DELETE /league/:leagueId
     * This route is protected - requires valid JWT token
     * @param user - The user deleting the league, extracted from the JWT token
     * @param leagueId - The ID of the league to delete
     * @returns a success message indicating the league was deleted
     */
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(':leagueId')
    async deleteLeague(
        @GetUser() user: User,
        @Param() leagueParamsDto: LeagueParamsDto,
    ) {
        await this.leagueService.deleteLeague(user, leagueParamsDto.leagueId);
        return {
            message: 'League deleted successfully'
        };
    }
}