import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { GameRoomEntity } from './game-room.entity';
import { PlayerSantaLetterEntity } from './player-santa-letter.entity';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class ChatSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: true,
  })
  chatId!: string;

  @Column({
    nullable: false,
  })
  firstName!: string;

  @Column({
    nullable: false,
  })
  userName!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  role!: Role;

  @RelationId((val: ChatSessionEntity) => val.gameRoom)
  @Column()
  gameRoomId!: string;

  @ManyToOne(() => GameRoomEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  gameRoom!: GameRoomEntity;

  @OneToOne(() => PlayerSantaLetterEntity, (letter) => letter.session)
  letter!: PlayerSantaLetterEntity;
}
