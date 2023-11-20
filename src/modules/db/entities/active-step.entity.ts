import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatSessionEntity } from './chat-session.entity';

@Entity()
export class ActiveStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => ChatSessionEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  session!: ChatSessionEntity;

  @Column({
    nullable: false,
  })
  type!: string;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  data?: unknown;
}
