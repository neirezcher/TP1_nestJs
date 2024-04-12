import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import {SkillService} from "../skill/skill.service";
import {AuthService} from "../auth/auth.service";
import {CvService} from "../cv/cv.service";
import {
    randEmail, randFilePath,
    randFirstName,
    randJobTitle,
    randLastName, randNumber,
    randPassword,
    randSkill,
    randUserName
} from '@ngneat/falso';
import {SkillEntity} from "../skill/entities/skill.entity";
import {UserEntity} from "../auth/entities/user.entity";
import {CvEntity} from "../cv/entities/cv.entity";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const skillService = app.get(SkillService);
    const userService = app.get(AuthService)
    const cvService = app.get(CvService)

    const skills=[]
   // Créez un nombre spécifique supplémentaire de compétences
  for (let j = 0; j < 12; j++) {
    const skill = new SkillEntity();
    skill.designation = randSkill();
    try {
      const newSkill = await skillService.create(skill);
      skills.push(newSkill);
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la création d\'une compétence supplémentaire:', error);
    }
  }

    for (let i = 0; i < 10; i++) {
        const user = new UserEntity()
        user.email=randEmail()
        user.username=randUserName()
        user.password=randPassword()
        const cv=new CvEntity()
        cv.firstname=randFirstName()
        cv.lastname=randLastName()
        cv.job=randJobTitle()
        cv.age=i+18
        cv.path=randFilePath()
        cv.cin=randNumber().toString()
        cv.user=user
        cv.skills=[
            skills[i],
            skills[i+1],
            skills[i+2]
        ]
        const newUser = await userService.register(user);
        await cvService.createUsingCv(cv,newUser)
    }
    await app.close();
}
bootstrap();