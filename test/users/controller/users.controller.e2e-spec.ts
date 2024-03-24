import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './../../utils/setupTestApp';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Hello World!');
  });
});
