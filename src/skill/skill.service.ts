import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillEntity } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
  ) {}

  // create a new skill
  async create(createSkillDto: CreateSkillDto) {
      // Check if the skill already exists in the database
    const existingSkill = await this.skillRepository.findOne({ where: { designation: createSkillDto.designation } });

    if (existingSkill) {
      // If the skill already exists, throw a notification indicating it already exists
      throw new ConflictException(`Skill with designation '${createSkillDto.designation}' already exists`);
    }
      // If the skill does not exist, create and save the new skill
    return await this.skillRepository.save(createSkillDto);
  }
  
  // retreive all skills available
  async findAll():Promise<SkillEntity[]> {
    return await this.skillRepository.find();
  }
  
  // retreive skill based on its ID if existed
  async findOne(id: number): Promise<SkillEntity> {
    const skill = await this.skillRepository.findOne({where : {"id" : id}});
    if(!skill) throw new NotFoundException(`todo of id ${id} not found`);
    return skill;
  }

  // update skill Desigantion if the skill existed
  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOne({where : {"id" : id}});
    if(!skill) throw new NotFoundException(`todo of id ${id} not found`);
    return await this.skillRepository.update(id, updateSkillDto);
  }

  // delete skill if existed
  async remove(id: number) {
    const skill = await this.skillRepository.findOne({where : {"id" : id}});
    if(!skill) throw new NotFoundException(`todo of id ${id} not found`);
    return await this.skillRepository.delete(id);
  }
}
