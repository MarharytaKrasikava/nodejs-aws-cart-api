import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APIGatewayProxyHandler } from 'aws-lambda';
import helmet from 'helmet';
import * as serverlessExpress from '@vendia/serverless-express';

async function bootstrap() {
  console.log('bootstrapping app...');
  const app = await NestFactory.create(AppModule);
  console.log('app created');

  app.enableCors();
  app.use(helmet());

  console.log('initializing app...');
  await app.init();

  if (process.env.NODE_ENV !== 'AWS_LAMBDA') {
    console.log('starting app for local development');
    const port = 4000;
    await app.listen(port);
    return app;
  }

  const expressApp = app.getHttpAdapter().getInstance();
  console.log('configured app for AWS Lambda');

  return serverlessExpress.configure({ app: expressApp });
  // cachedServer = serverlessExpress({ app: expressApp });
}

let server: any;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2)); // Add logging for debugging
  server = server ?? (await bootstrap());
  return server(event, context);
};

if (process.env.NODE_ENV !== 'AWS_LAMBDA') {
  bootstrap().then((server) => {
    const port = process.env.PORT || 4000;
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
