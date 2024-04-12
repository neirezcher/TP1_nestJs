// entities/cv.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { SkillEntity } from '../../skill/entities/skill.entity';

@Entity()
export class CvEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: string;

  @Column()
  job: string;

  @Column()
  path: string;

  @ManyToOne(() => UserEntity, user => user.cvs,
  {
    eager: false,
    nullable: false
  })
  //@JoinColumn({name: 'user_id'})
  user: UserEntity;

  @ManyToMany(() => SkillEntity, (skill) => skill.cvs, { eager: true })
  @JoinTable()
  skills: SkillEntity[];
}
