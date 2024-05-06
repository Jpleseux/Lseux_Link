import { NestFactory } from "@nestjs/core";
import { AppModule } from "./http/nestjs/app.module";
import { urlencoded, json } from "express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "./http/nestjs/auth/auth.module";
import { ProfileModule } from "./http/nestjs/profile/profile.module";
import { PostsModule } from "./http/nestjs/posts/post.module";
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "*",
    credentials: true,
  };

  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.enableCors(corsOptions);
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("LseuxLink")
    .setDescription("Documentação LseuxLink")
    .setVersion("1.0")
    .addTag("Auth")
    .addTag("Profile")
    .addTag("Posts")
    .build();

  swaggerConfig.security = [{ bearerAuth: [] }];
  swaggerConfig.components = {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  };

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [ProfileModule, AuthModule, PostsModule],
  });

  SwaggerModule.setup("doc", app, swaggerDoc);
  await app.listen(3000);
}

bootstrap();
