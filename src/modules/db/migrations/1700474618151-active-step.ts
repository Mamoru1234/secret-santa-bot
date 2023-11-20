import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveStep1700474618151 implements MigrationInterface {
  name = 'ActiveStep1700474618151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "active_step_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "data" jsonb, "sessionId" uuid NOT NULL, CONSTRAINT "REL_9e986603b83dcb46fcfc2ad82b" UNIQUE ("sessionId"), CONSTRAINT "PK_6822b265d7c689615ac34cdf256" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "active_step_entity" ADD CONSTRAINT "FK_9e986603b83dcb46fcfc2ad82b4" FOREIGN KEY ("sessionId") REFERENCES "chat_session_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "active_step_entity" DROP CONSTRAINT "FK_9e986603b83dcb46fcfc2ad82b4"`);
    await queryRunner.query(`DROP TABLE "active_step_entity"`);
  }
}
