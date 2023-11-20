import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatSession1700469163523 implements MigrationInterface {
  name = 'ChatSession1700469163523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_session_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chatId" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userName" character varying NOT NULL, CONSTRAINT "PK_fae0fb01a1927d2351c04719901" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3035411af64db200a8b31830e2" ON "chat_session_entity" ("chatId") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_3035411af64db200a8b31830e2"`);
    await queryRunner.query(`DROP TABLE "chat_session_entity"`);
  }
}
