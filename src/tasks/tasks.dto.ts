import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

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
    @IsString()
    @IsOptional()
    readonly responsableUser: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly creatorUser: string;
}

export class updateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly responsableUser: string;

    @ApiProperty({ type: 'boolean' })
    @IsBoolean()
    @IsOptional()
    readonly deleted: boolean;

    @ApiProperty({ type: 'timestamptz' })
    @IsDateString()
    @IsOptional()
    readonly startDate: Date;

    @ApiProperty({ type: 'timestamptz' })
    @IsDateString()
    @IsOptional()
    readonly endDate: Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly status: TaskStatus;
}

enum TaskStatus {
    PENDING = 'pendiente',
    IN_PROGRESS = 'en progreso',
    COMPLETED = 'finalizada',
}

export class FilterTasksDto {
    @IsOptional()
    @IsString()
    filterName: string;

    @IsOptional()
    @IsString()
    filterStatus: TaskStatus;

    @IsOptional()
    @IsString()
    filterResponsable: string;
}