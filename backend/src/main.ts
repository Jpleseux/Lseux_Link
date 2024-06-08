import { NestFactory } from "@nestjs/core";
import { AppModule } from "./http/nestjs/app.module";
import { urlencoded, json } from "express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "./http/nestjs/auth/auth.module";
import { ProfileModule } from "./http/nestjs/profile/profile.module";
import { PostsModule } from "./http/nestjs/posts/post.module";
import { ChatsModule } from "./http/nestjs/blogs/chats.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { apiReference } from "@scalar/nestjs-api-reference";
import { NotificationModule } from "./http/nestjs/notifications/notification.module";
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
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
    include: [ProfileModule, AuthModule, PostsModule, ChatsModule, NotificationModule],
  });
  app.use(
    "/doc",
    apiReference({
      spec: {
        content: swaggerDoc,
      },
      darkMode: true,
      baseServerURL: process.env.PORT,
      theme: "kepler",
    }),
  );
  await app.listen(3000);
}

bootstrap();
