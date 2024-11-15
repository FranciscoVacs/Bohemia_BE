import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities : ["dist/**/*.entity.js"],
    entitiesTs : ["src/**/*.entity.ts"],
    dbName: "bohemiadb",
    driver: MySqlDriver,
    clientUrl: "mysql://root:root@localhost:3306/bohemiadb",
    debug: true,
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
