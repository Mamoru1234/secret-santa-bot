import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameRoom1700470313054 implements MigrationInterface {
  name = 'GameRoom1700470313054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_room_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adminToken" uuid NOT NULL, "userToken" uuid NOT NULL, CONSTRAINT "PK_7b285db21b709b5101d7f9b2391" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "chat_session_entity" ADD "role" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chat_session_entity" ADD "gameRoomId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "chat_session_entity" ADD CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd" FOREIGN KEY ("gameRoomId") REFERENCES "game_room_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd"`);
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP COLUMN "gameRoomId"`);
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TABLE "game_room_entity"`);
  }
}
