import { BelongsToMany, Column, DataType, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";


@Table({
    tableName: "task",
    freezeTableName: true,
})
export class Tasks extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true
    })
    id: string

    @Column({
        type: DataType.TEXT
    })
    title: string

    @Column({
        type: DataType.TEXT,
    })
    status: string
    
    @Column({
        type: DataType.TEXT
    })
    description: string
    
    @Column({
        type: DataType.INTEGER
    })
    priority: number

    @Column({
        type: DataType.DATEONLY
    })
    expirationDate: Date

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    userId_creator: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    userId_responsible: string
}
