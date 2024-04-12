import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Query,UnauthorizedException,UseGuards } from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'; // Importez les types Multer
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCVDto } from './dto/search-cv.dto';
import { UserRole } from '../common/user-role.enum';
import { CvEntity } from './entities/cv.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
      @Body() createCvDto: CreateCvDto,
      @Req() req
      ) {
    return await this.cvService.create(createCvDto, req.user);
  }
/*
  
  async findAll(
    @Req() req
  ) {
    const user = req['user'];
        if(user.role === UserRole.ADMIN)
        {
          return await this.cvService.findAll();
        }else{
          return await this.cvService.findOne(user.id);
        }
  }
*/

  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAll(@Query() searchDto: SearchCVDto, @Req() req): Promise<[CvEntity[], number]> {
    // Extract search criteria from DTO
    const { criteria, age, page, pageSize } = searchDto;

    // If neither criteria nor age is provided, return all CVs
    if (!criteria && !age) {
      //return this.cvService.findAll();
      const take = pageSize || 10; // Default pageSize to 10 if not provided
      return this.cvService.findAll(page, take);
    }

    // Otherwise, perform search based on provided criteria
    return this.cvService.filter(searchDto);
  }
   
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async findOne(
      @Param('id') id: string,
      @Req() req
      ) {
        const user = req['user'];
        if(user.role === UserRole.ADMIN)
        {
          return await this.cvService.findOne(id);
        }else{
          return await this.cvService.getAllCvsByUserIdByid(id,user.id);
        }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async update(
      @Param('id') id: string, 
      @Body() updateCvDto: UpdateCvDto,
      @Req() req
      ) {
        const cv = await this.cvService.findOne(id);
        if (cv.user.id !== req.userId) {
          throw new UnauthorizedException('You are not authorized to delete this CV');
        }
    return await this.cvService.update(id, updateCvDto, req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async remove(
      @Param('id') id: string,
      @Req() req,
      ) {
        const cv = await this.cvService.findOne(id);
        if (cv.user.id !== req.userId) {
          throw new UnauthorizedException('You are not authorized to delete this CV');
        }  
      return await this.cvService.remove(id, req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file); // Fichier téléversé
    return { message: 'Fichier téléversé avec succès' };
  }


}
