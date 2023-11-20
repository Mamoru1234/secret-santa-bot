import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatSessionV31700472704808 implements MigrationInterface {
  name = 'ChatSessionV31700472704808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd"`);
    await queryRunner.query(`ALTER TABLE "chat_session_entity" ALTER COLUMN "gameRoomId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "chat_session_entity" ADD CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd" FOREIGN KEY ("gameRoomId") REFERENCES "game_room_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chat_session_entity" DROP CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd"`);
    await queryRunner.query(`ALTER TABLE "chat_session_entity" ALTER COLUMN "gameRoomId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "chat_session_entity" ADD CONSTRAINT "FK_71b6b945136e2ddb5b2d32b8ffd" FOREIGN KEY ("gameRoomId") REFERENCES "game_room_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
