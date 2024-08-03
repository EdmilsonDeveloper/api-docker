import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "user",
    freezeTableName: true,
})
export class User extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true
    })
    id: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    username: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    password: string
}