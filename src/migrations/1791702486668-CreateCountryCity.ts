import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryCity1791702486668 implements MigrationInterface {
    name = 'CreateCountryCity1791702486668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "country_id" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_08af2eeb576770524fa05e26f39" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d0466ca4c350253867a0c708923" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO "country" ("name") VALUES ('Ukraine'), ('Poland'), ('Germany'), ('France')`);
        await queryRunner.query(`INSERT INTO "city" ("name", "country_id") VALUES ('Kyiv', (SELECT "id" FROM "country" WHERE "name" = 'Ukraine')), ('Warsaw', (SELECT "id" FROM "country" WHERE "name" = 'Poland')), ('Berlin', (SELECT "id" FROM "country" WHERE "name" = 'Germany')), ('Paris', (SELECT "id" FROM "country" WHERE "name" = 'France'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d0466ca4c350253867a0c708923"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_08af2eeb576770524fa05e26f39"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "country"`);
    }

}
