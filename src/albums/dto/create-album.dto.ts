import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  year: number;
  @IsNotEmpty()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;
}
