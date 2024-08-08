import { SequelizeModuleOptions } from '@nestjs/sequelize';
require('dotenv').config()

export const sequelizeConfig: SequelizeModuleOptions = {

    dialect: 'mariadb',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_ROOT_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadModels: true,
    synchronize: true

}; 