import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
@IsUUID()
@IsOptional()
id: string;

@IsString()
@IsNotEmpty()
username: string;

@IsString()
@IsNotEmpty()
password: string;
}

export interface CreateUserResponse {
id: string;
username: string;
}
