import { DataSource } from "typeorm";
import config from ".";
import { join } from "path";
import * as dotenv from 'dotenv';

// export default new DataSource({
//     type: 'postgres',
//     url: config.databaseUrl,
//     synchronize: true,
//     entities: [join(__dirname, '../entities/*.entity.{ts,js}')],
//     migrations: [join(__dirname, '../migrations/*.entity.{ts,js}')],
//     logging: true
// });
dotenv.config();

export default new DataSource({
    type: 'mysql',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    synchronize: true,
    logging: true,
    entities: [join(__dirname, '../entities/*.entity.{ts,js}')],
    migrations: [join(__dirname, '../migrations/*.{ts,js}')],
});