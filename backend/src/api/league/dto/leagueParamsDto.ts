import { IsNotEmpty } from 'class-validator';
import { IsCuid } from '../../../custom/validators/is-cuid.validator';

export class LeagueParamsDto {
    @IsCuid({ message: 'League ID must be a valid CUID' })
    @IsNotEmpty({ message: 'League ID is required' })
    leagueId: string;
}