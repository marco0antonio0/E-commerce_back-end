import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'cart_items' })
export class CartEntity extends Model<CartEntity> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    productId: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    userEmail: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    purchased: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    provider: string;
}
