import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  // Add global validation pipe - THIS WAS MISSING!
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  // Fixed CORS configuration
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Fixed: was "method", should be "methods"
    credentials: true, // Fixed: was "Credential", should be "credentials"
  });

  await app.listen(process.env.PORT ?? 3002);
  console.log("Application running on port", process.env.PORT ?? 3002);
}
bootstrap();
