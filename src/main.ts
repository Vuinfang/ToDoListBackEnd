import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //CORS
  app.enableCors();
  //Swagger API start===================
  const config = new DocumentBuilder()
    .setTitle('ToDoList')
    .setDescription('The ToDoList API description')
    .setVersion('1.0')
    .addTag(
      'User',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV === 'development') {
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  }
  SwaggerModule.setup('api', app, document);
  //Swagger API end===========================
  await app.listen(3000);
}

bootstrap();
