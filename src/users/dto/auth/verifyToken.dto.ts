import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    description: 'JWT accesstoken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyQGV4YW1wbGUuY29tIiwidXVpZCI6ImM2MWM1ZTY3LWUyOTMtNDM0My1iYmQ0LWI0ZmY0MWFjYTFiMiIsInJvbGUiOiJNRU1CRVIiLCJpYXQiOjE3MTI0OTg0MzV9.sLOSLS6YJdWo8lpStPgeUPztBKQuIQcV_b2mYWZuNNg',
  })
  access_token: string;
}
