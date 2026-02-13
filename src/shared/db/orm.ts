import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST ?? "localhost";
const dbPort = process.env.DB_PORT ?? "3306";
const dbName = process.env.DB_NAME ?? "bohemiadb";
const dbUser = process.env.DB_USER ?? "root";
const dbPassword = process.env.DB_PASSWORD ?? "root";

export const orm = await MikroORM.init({
    entities : ["dist/**/*.entity.js"],
    entitiesTs : ["src/**/*.entity.ts"],
    dbName: dbName,
    driver: MySqlDriver,
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: dbPassword,
    debug: process.env.NODE_ENV !== "production",
    highlighter: new SqlHighlighter(),
    schemaGenerator: {
        disableForeignKeys:true,
        createForeignKeyConstraints:true,
        ignoreSchema:[],
    },
});

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    /*
    await generator.dropSchema();
    await generator.createSchema();
    
    await generator.updateSchema();
    */
};
