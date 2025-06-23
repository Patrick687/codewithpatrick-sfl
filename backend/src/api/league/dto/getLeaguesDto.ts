import { IsNotEmpty, IsString } from "class-validator";
import { IsCuid } from "../../../custom/validators/is-cuid.validator";

export class GetLeagueDto {
    /**
     * League ID validation:
     * - Must be a non-empty string
     * - Must be a valid UUID format
     * - Matches the pattern of a UUID (version 4)
     */
    @IsString({ message: 'League ID must be a string' })
    @IsNotEmpty({ message: 'League ID is required' })
    @IsCuid({ message: 'League ID must be a valid CUID' })
    leagueId: string;
}