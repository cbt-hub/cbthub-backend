import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './utils/setupTestApp';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
