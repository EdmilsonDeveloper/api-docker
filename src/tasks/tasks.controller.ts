import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTasksDto, TasksParameters } from './tasks.dto';
import { Tasks } from './task.model';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    
    constructor(private readonly taskService: TasksService){}

    @Post()
    async create(@Body() taskData: CreateTasksDto, @Headers('Authorization') request: string): Promise<Tasks> {
        return await this.taskService.create(taskData, request)
    }

    @Get()
    findAll(@Query() query: TasksParameters, @Headers('Authorization') request: string): Promise<Tasks[]> {
        return this.taskService.findAll(query, request);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() taskData): Promise<[number, Tasks[]]> {
        return this.taskService.update(String(id), taskData)
    }

    // @Patch(':id/acceptreject')
    // acceptReject(@Param('id') id: string, @Body()taskData): Promise<[number, Tasks[]]> {
    //     return this.taskService.acceptReject(String(id), taskData)
    // }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.taskService.delete(String(id))
    }
}
