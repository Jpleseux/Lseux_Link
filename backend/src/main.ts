import { NestFactory } from "@nestjs/core";
import { AppModule } from "./http/nestjs/app.module";
import { urlencoded, json } from "express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "./http/nestjs/auth/auth.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.enableCors();
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle("portfolio")
    .setDescription("Documentação portfolio")
    .setVersion("1.0")
    .addTag("Auth")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" }, "Authorization")
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AuthModule],
  });
  SwaggerModule.setup("doc", app, swaggerDoc);
  await app.listen(3000);
}
bootstrap();
