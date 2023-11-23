import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { GameRoomEntity } from './game-room.entity';

@Entity()
export class PlayerPairEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    nullable: false,
  })
  aName!: string;

  @Column({
    nullable: false,
  })
  bName!: string;

  @RelationId((val: PlayerPairEntity) => val.gameRoom)
  @Column()
  gameRoomId!: string;

  @ManyToOne(() => GameRoomEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  gameRoom!: GameRoomEntity;
}
