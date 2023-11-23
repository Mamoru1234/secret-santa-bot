import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlayerPair1700756777844 implements MigrationInterface {
  name = 'PlayerPair1700756777844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player_pair_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aName" character varying NOT NULL, "bName" character varying NOT NULL, "gameRoomId" uuid NOT NULL, CONSTRAINT "PK_65d07b659a6d4341c2c1bce80fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_pair_entity" ADD CONSTRAINT "FK_0e2538c357b65e8ba4d0f6713af" FOREIGN KEY ("gameRoomId") REFERENCES "game_room_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "player_pair_entity" DROP CONSTRAINT "FK_0e2538c357b65e8ba4d0f6713af"`);
    await queryRunner.query(`DROP TABLE "player_pair_entity"`);
  }
}
