import { NestFactory } from "@nestjs/core";
import { AppModule } from "./http/nestjs/app.module";
import { urlencoded, json } from "express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "./http/nestjs/auth/auth.module";
import { ProfileModule } from "./http/nestjs/profile/profile.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const corsOptions = {
    origin: "http://localhost:5173",
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
    include: [ProfileModule, AuthModule],
  });

  SwaggerModule.setup("doc", app, swaggerDoc);
  await app.listen(3000);
}

bootstrap();
