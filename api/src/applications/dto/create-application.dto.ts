import {
  IsString,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  pet_id: string;

  // ETAPA 1: Dados Pessoais e Endereço
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  cpf: string;

  @IsDateString()
  birth_date: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip_code: string;

  // ETAPA 2: Informações sobre Moradia
  @IsString()
  @IsIn(['house', 'apartment'])
  housing_type: 'house' | 'apartment';

  @IsString()
  @IsIn(['own', 'rent', 'family'])
  housing_ownership: 'own' | 'rent' | 'family';

  @IsBoolean()
  has_yard: boolean;

  @IsOptional()
  @IsBoolean()
  yard_fenced?: boolean;

  @IsInt()
  @Min(1)
  household_size: number;

  @IsBoolean()
  has_children: boolean;

  @IsOptional()
  @IsString()
  children_ages?: string;

  @IsBoolean()
  all_agree: boolean;

  // ETAPA 3: Experiência com Pets
  @IsBoolean()
  has_current_pets: boolean;

  @IsOptional()
  @IsString()
  current_pets_description?: string;

  @IsOptional()
  @IsString()
  previous_pets_experience?: string;

  @IsString()
  daily_hours_alone: string;

  @IsString()
  who_cares_when_away: string;

  @IsString()
  @IsIn(['ready', 'partially', 'learning'])
  financial_readiness: 'ready' | 'partially' | 'learning';

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthly_budget?: number;

  // ETAPA 4: Motivação e Compromisso
  @IsString()
  adoption_reason: string;

  @IsString()
  what_if_moving: string;

  @IsBoolean()
  long_term_commitment: boolean;

  @IsBoolean()
  accepts_follow_up_visits: boolean;
}
