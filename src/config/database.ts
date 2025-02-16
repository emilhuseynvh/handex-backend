import { DataSource } from "typeorm";
import config from ".";
import { join } from "path";

export default new DataSource({
    type: 'postgres',
    url: config.databaseUrl,
    synchronize: true,
    entities: [join(__dirname, '../entities/*.entity.{ts,js}')],
    migrations: [join(__dirname, '../migrations/*.entity.{ts,js}')],
    logging: true
});