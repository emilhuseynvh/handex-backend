import { DataSource } from "typeorm";
import config from ".";
import { join } from "path";

export default new DataSource({
    type: 'postgres',
    url: config.databaseUrl,
    synchronize: true,
    entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
    migrations: [],
    logging: true
});