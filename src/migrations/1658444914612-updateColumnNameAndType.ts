import {MigrationInterface, QueryRunner} from "typeorm";

export class updateColumnNameAndType1658444914612 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE ocasions RENAME COLUMN descrição TO description;`);
        await queryRunner.query(`ALTER TABLE ocasions ADD COLUMN latitude varchar;`);
        await queryRunner.query(`ALTER TABLE ocasions ADD COLUMN longitude varchar;`);
        await queryRunner.query(`ALTER TABLE users ALTER COLUMN avatar TYPE varchar;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
