import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatSessionV21700471695190 implements MigrationInterface {
  name = 'ChatSessionV21700471695190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP COLUMN "lastName"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_session_entity" ADD "lastName" character varying NOT NULL`);
  }
}
