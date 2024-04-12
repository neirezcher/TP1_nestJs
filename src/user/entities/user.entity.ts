// entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CvEntity } from '../../cv/entities/cv.entity';
import { UserRole } from "../../common/user-role.enum";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ length: 255, nullable: false, unique:true })
  username: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @Column()
    salt : string; 

  @Column({ default: true })
  isActive: boolean;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    })
   role : string;

    @OneToMany(
        ()=>CvEntity,
        (cv)=> cv.user
    )
    cvs : CvEntity[]
}


