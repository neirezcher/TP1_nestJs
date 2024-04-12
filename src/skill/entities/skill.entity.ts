// entities/skill.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { CvEntity } from '../../cv/entities/cv.entity';
@Entity()
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @ManyToMany(() => CvEntity, (cv) => cv.skills)
  @JoinTable()
  cvs: CvEntity[];
}
