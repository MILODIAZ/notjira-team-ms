import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class taskDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty()
    @IsPositive()
    @IsOptional()
    readonly projectId: number;

    @ApiProperty()
    @IsPositive()
    @IsOptional()
    readonly userId: number;
}