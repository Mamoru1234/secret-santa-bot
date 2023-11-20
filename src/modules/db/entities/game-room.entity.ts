import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', {
    nullable: false,
  })
  adminToken!: string;

  @Column('uuid', {
    nullable: false,
  })
  userToken!: string;
}
