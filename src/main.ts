import "dotenv/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Telegram Finance Bot API")
    .setDescription("API documentation for the personal finance bot MVP.")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup(
    "api",
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );
  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  Logger.log(`Finance bot is running on port ${port}; Swagger UI: /api`);
}
void bootstrap();
