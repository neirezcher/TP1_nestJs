import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';
import { SkillEntity } from '../skill/entities/skill.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCVDto } from './dto/search-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CvEntity)
    private cvRepository: Repository<CvEntity>,
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createCvDto: CreateCvDto, user: UserEntity) {
    const {skills, ...cvData} = createCvDto;
    const cv = this.cvRepository.create(cvData);
    cv.skills = [];
    for (const skill of createCvDto.skills) {
      const skillEntity = await this.skillRepository.findOne({
        where: {
          designation: skill,
        },
      });
      if (skillEntity) {
        cv.skills.push(skillEntity);
      } else {
        const newSkill = this.skillRepository.create();
        newSkill.designation = skill;
        await this.skillRepository.save(newSkill);
        cv.skills.push(newSkill);
      }
    }
    cv.user = user;
    return await this.cvRepository.save(cv);
  }


  async createUsingCv(cv: CvEntity, user: UserEntity) {
    cv.user = user;
    return await this.cvRepository.save(cv);
  }

  
  /*
  async findAll(): Promise<CvEntity[]> {
    return await this.cvRepository.find({
      relations: ['skills'],
    });
  }*/

  async findAll(page: number = 1, pageSize: number = 10): Promise<[CvEntity[], number]> {
    const [cvs, total] = await this.cvRepository.findAndCount({
      relations: ['skills'],
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    return [cvs, total];
  }

  async filter(searchDto: SearchCVDto): Promise<[CvEntity[],number]> {
    const { criteria, age, page = 1, pageSize = 10 } = searchDto;
    const skip = (page - 1) * pageSize;

    let query = this.cvRepository.createQueryBuilder('cv');

    if (criteria) {
      query = query.where('cv.criteria LIKE :criteria', { criteria: `%${criteria}%` });
    }

    if (age) {
      query = query.andWhere('cv.age = :age', { age });
    }

    const [data, total] = await query.skip(skip).take(pageSize).getManyAndCount();

    return [ data, total];
}



  async getAllCvsByUserId(userId: string): Promise<CvEntity[]> {
    const queryBuilder = this.cvRepository.createQueryBuilder('cv');
    queryBuilder
      .leftJoinAndSelect('cv.skills', 'skill')
      .innerJoin('cv.user', 'user')
      .where('user.id = :userId', { userId });

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<CvEntity> {
    const cv= await this.cvRepository.findOne({
      where: {
        id: id,
    },
    relations: ['skills'],
  });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
  }
    return cv
  }

  async getAllCvsByUserIdByid(cvId: string, userId: any) {
    const queryBuilder = this.cvRepository.createQueryBuilder('cv');
    queryBuilder
      .leftJoinAndSelect('cv.skills', 'skill')
      .innerJoin('cv.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('cv.id = :cvId', { cvId });
    const count =await queryBuilder.getCount();
    if (count === 0) {
      throw new NotFoundException('Cv not found');
    }
    return await queryBuilder.getOne();
  }

  async update(id: string, updateCvDto: UpdateCvDto, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: {
        id: id,
      },
      relations: ['skills', 'user'],
    });
    if (!cv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    if (cv.user.id !== userId) {
      throw new UnauthorizedException(`User with id ${userId} is not authorized to update this CV`);
    }
    const updatedCv = Object.assign(cv, updateCvDto);
    await this.cvRepository.save(updatedCv);
    const returnObj = {"id": updatedCv.id, "message": "CV updated successfully"};
    return returnObj;

  }

  async remove(id: string, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: {
        id: id,
      },
      relations: ['skills', 'user'],
    }); // Vérifie si le CV existe
    if (!cv) {
      throw new NotFoundException(`CV with id ${id} not found`);
    }
    if (cv.user.id  !== userId) {
      throw new UnauthorizedException(`User with id ${userId} is not authorized to delete this CV`);
    }
    await this.cvRepository.delete(cv.id);
    //await this.cvRepository.remove(cv);
    const returnObj = {"id": cv.id, "message": "CV deleted successfully"};
    return returnObj;
  }

}



