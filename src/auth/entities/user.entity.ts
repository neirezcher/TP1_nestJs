// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Timestamp } from "../../common/database/timestamp.entity";
import { CvEntity } from '../../cv/entities/cv.entity';
import { UserRole } from "../../common/user-role.enum";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class UserEntity extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column(
    {
      nullable: false
    }
  )
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string; 

  @Column()
  email: string;

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

  
  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword === this.password;
  }
}
