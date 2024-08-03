import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export enum TasksPriorityEnum {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
}

export enum TasksStatusEnum {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    IN_PROGRESS = 'IN_PROGRESS',
}

export class CreateTasksDto {
    @IsUUID()
    @IsOptional()
    id: string;

    @IsString()
    @MinLength(3)
    @MaxLength(256)
    @IsNotEmpty()
    title: string;

    @IsString()
    @MinLength(5)
    @MaxLength(512)
    @IsNotEmpty()
    description: string;

    @IsEnum(TasksStatusEnum)
    @IsOptional()
    status: string;

    @IsEnum(TasksPriorityEnum)
    @IsOptional()
    priority: number;

    @IsDateString()
    expirationDate: Date;

    @IsUUID()
    @IsNotEmpty()
    userId_creator: string;

    @IsUUID()
    @IsNotEmpty()
    userId_responsible: string;
}

export interface TasksParameters {
    title: string;
    status: string;
    priority: number;
    expirationDate: Date;
    userId_creator: string;
    userId_responsible: string;
}