import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Tasks } from 'src/tasks/task.model';
import { CreateTasksDto, TasksParameters, TasksPriorityEnum, TasksStatusEnum } from './tasks.dto';
import { Op } from 'sequelize';

@Injectable()
export class TasksService {
    private jwtSecret: string;
    constructor(
        @InjectModel(Tasks)
        private readonly tasksModel: typeof Tasks,

        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    }

    async create(taskData: CreateTasksDto, request: string): Promise<Tasks> {

        try {
            const token = request.split(' ')[1];
    
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: this.jwtSecret,
            });
    
            const createdTask = {
                title: taskData.title,
                status: TasksStatusEnum.PENDING,
                description: taskData.description,
                priority: TasksPriorityEnum.ONE,
                expirationDate: taskData.expirationDate,
                userId_creator: decoded.sub,
                userId_responsible: taskData.userId_responsible,
            };
    
            return await this.tasksModel.create(createdTask);
            
        } catch (error) {
            console.log(error);
            throw new HttpException('error at create task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(query: TasksParameters, request: string): Promise<Tasks[]> {

        try {
            const where: any = await {};
        
            if (query.title) {
                const titleRegex = /^[a-zA-Zà-úÀ-Ú]+(([',. -][a-zA-Zà-úÀ-Ú ])?[a-zA-Zà-úÀ-Ú]+)*$/; 
                if (!titleRegex.test(query.title)) {
                    throw new BadRequestException('Título inválido'); 
                }
                where.title = { [Op.like]: `%${query.title}%` }
            }
        
            if (query.status) {
                where.status = query.status
            }
        
            if (query.priority) {
                where.priority = query.priority
            }
        
            if (query.expirationDate) {
                where.expirationDate = query.expirationDate
            }
        
            const token = request.split(' ')[1];
        
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: this.jwtSecret,
            });
        
            where.userId_creator = decoded.sub
        
            const tasks = await this.tasksModel.findAll({ where });
        
            if (!tasks) {
                
                where.userId_responsible = decoded.sub
        
                const tasks = await this.tasksModel.findAll({ where });
        
                if (!tasks) {
                    throw new HttpException(
                        `Tasks not found`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
        
                return tasks
        }
            
        } catch (error) {
            console.log(error);
            throw new HttpException('error at list tasks', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, taskData): Promise<[number, Tasks[]]> {
        try {
            const [affectedCount, affectedRows] = await this.tasksModel.update(taskData, {where: {id}, returning: true});
    
            if (!affectedCount || !affectedRows) {
                throw new HttpException(
                  `Task with id '${id}' not found`,
                  HttpStatus.BAD_REQUEST,
                );
            }
    
            return [affectedCount, affectedRows as Tasks[]];
            
        } catch (error) {
            console.log(error);
            throw new HttpException('error at update task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async acceptReject (id: string, taskData){
        
    //     try {
    //         const acceptReject = await this.tasksModel.update(taskData, {where:{id}, returning: true});

    //         if (!acceptReject) {
    //             throw new HttpException(
    //               `Task with id '${id}' not found`,
    //               HttpStatus.BAD_REQUEST,
    //             );
    //         }

    //         return acceptReject
            
    //     } catch (error) {
    //         console.log(error);
    //         throw new HttpException('error at accept or reject task', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async delete(id: string){

        try {
            const result = await this.tasksModel.destroy({where: {id}})
    
            if (!result) {
                throw new HttpException(
                  `Task with id '${id}' not found`,
                  HttpStatus.BAD_REQUEST,
                );
            }
            
        } catch (error) {
            console.log(error);
            throw new HttpException('error at update task', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
