import { MikroORM } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*entity.ts'],
    dbName: 'bohemia',
    clientUrl: 'mysql://francisco:root@localhost:3306/bohemia',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator:{
        disableForeignKeys: true,
        createForeignKeyConstraints:true,
        ignoreSchema: [],
    },
})

export const syncSchema = async ()=>{
    const generator = orm.getSchemaGenerator()
    await generator.updateSchema()
}