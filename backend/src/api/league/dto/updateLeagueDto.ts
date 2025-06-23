import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateLeagueDto {
    /**
     * League Name validation:
     * - Must be at least 4 characters long
     * - Cannot be empty
     * - Must be a string of letters, numbers, spaces, and basic special characters
     */
    @IsOptional()
    @IsString({ message: 'League name must be a string' })
    @IsNotEmpty({ message: "League name is required" })
    @MinLength(4, { message: "League name must be at least 4 characters long" })
    @Matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, {
        message: 'League name can only contain letters, numbers, spaces, and basic special characters'
    })
    name?: string;


    /**
     * LeagueDescription validation:
     * - Optional field
     * - Must be a string if provided
     * - Can contain letters, numbers, spaces, and basic special characters
     * - Maximum length of 500 characters
     */
    @IsOptional()
    @IsString({ message: 'League description must be a string' })
    @MaxLength(500, { message: 'League description cannot exceed 500 characters' })
    @Matches(/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
        message: 'League description can only contain letters, numbers, spaces, and basic special characters'
    })
    description?: string;
}