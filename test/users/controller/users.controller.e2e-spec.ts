import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './../../utils/setupTestApp';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  // 사용자 생성 테스트
  it('/users (POST)', async () => {
    const createUserDto = {
      email: 'john.doe@example.com',
      nickname: 'JohnDoe123',
      password: 'securePassword',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201) // 상태 코드가 201인지 확인
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            email: createUserDto.email,
            nickname: createUserDto.nickname,
          }),
        );
      });
  });

  // 모든 사용자 조회 테스트
  it('/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: 'john.doe@example.com',
              nickname: 'JohnDoe123',
            }),
          ]),
        );
      });
  });

  // 특정 사용자 조회 테스트
  it('/users/:id (GET)', async () => {
    const userId = 1; // 예제로 사용할 사용자 ID

    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining({ id: userId }));
      });
  });

  // 사용자 정보 업데이트 테스트
  it('/users/:id (PATCH)', async () => {
    const userId = 1;
    const updateUserDto = {
      nickname: 'Jane Doe',
      email: 'jane.doe@example.com',
    };

    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateUserDto)
      .expect(200) // 성공적으로 업데이트 되었는지 상태 코드로 확인
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(updateUserDto));
      });
  });

  // 사용자 삭제 테스트
  it('/users/:id (DELETE)', async () => {
    const userId = 1;

    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200); // 사용자가 성공적으로 삭제되었는지 상태 코드로 확인
  });
});
