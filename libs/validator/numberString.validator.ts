import { BadRequestException } from '@nestjs/common';

export function checkNumberString(value: string) {
  if (!/^[0-9]*$/.test(value)) {
    throw new BadRequestException('숫자만 입력해주세요.');
  }
}
