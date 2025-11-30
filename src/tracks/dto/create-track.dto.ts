import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
  @IsNotEmpty()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  albumId: string | null;
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
