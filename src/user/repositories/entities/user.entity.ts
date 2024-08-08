import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: "users" })
export class UserEntity extends Model<UserEntity> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column
    name: string;

    @Column
    email: string;

    @Column
    password: string;
}