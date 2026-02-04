import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateRequestDto {
  @IsNotEmpty({ message: 'API Key is required!' })
  @IsString({ message: 'API key must be a string!' })
  api_key: string;

  @IsNotEmpty({ message: 'Integration ID is required!' })
  @IsString({ message: 'Integration ID must be a string!' })
  integration_id: string;
}
