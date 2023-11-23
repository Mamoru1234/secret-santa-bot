import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatSessionEntity } from './chat-session.entity';

@Entity()
export class PlayerSantaLetterEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => ChatSessionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  session!: ChatSessionEntity;

  @Column({
    type: 'text',
    nullable: false,
  })
  letter!: string;
}
