import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsIn(['pending', 'under_review', 'approved', 'rejected'])
  status: 'pending' | 'under_review' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
