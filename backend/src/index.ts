import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './custom/exceptionFilter/HttpExceptionFilter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    // Enable global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Enable validation pipes globally
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true, // Reject requests with extra properties
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    // Enable CORS
    app.enableCors();

    const port = process.env.PORT || 3000;

    try {
        await app.listen(port);
        logger.log(`Application is running on: http://localhost:${port}`);
    } catch (error) {
        logger.error('Failed to start the application', error);
        process.exit(1);
    }
}

bootstrap().catch(error => {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
});