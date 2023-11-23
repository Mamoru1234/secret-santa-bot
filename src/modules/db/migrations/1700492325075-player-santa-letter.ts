import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlayerSantaLetter1700492325075 implements MigrationInterface {
  name = 'PlayerSantaLetter1700492325075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player_santa_letter_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "letter" text NOT NULL, "sessionId" uuid NOT NULL, CONSTRAINT "REL_ae2ab41f7256d55e8a94e43ceb" UNIQUE ("sessionId"), CONSTRAINT "PK_b1e92585c176218db2e8fb96fcc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_santa_letter_entity" ADD CONSTRAINT "FK_ae2ab41f7256d55e8a94e43ceb0" FOREIGN KEY ("sessionId") REFERENCES "chat_session_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "player_santa_letter_entity" DROP CONSTRAINT "FK_ae2ab41f7256d55e8a94e43ceb0"`);
    await queryRunner.query(`DROP TABLE "player_santa_letter_entity"`);
  }
}
