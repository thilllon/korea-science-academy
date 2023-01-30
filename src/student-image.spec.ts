import { describe, expect, it, jest, test } from '@jest/globals';
import { StudentImage } from './student-image';
import { Ksa } from './ksa';
import { ZodError } from 'zod';

describe('Image class', () => {
  // TODO
  test('throw when invalid student ID', () => {
    // // NOTE how to test private method
    // // https://stackoverflow.com/questions/48906484/how-to-unit-test-private-methods-in-typescript
    // const studentImage = new StudentImage();
    // const prototype = Object.getPrototypeOf(studentImage);
    // expect(prototype.url('20-0000')).toThrow(ZodError);
  });

  // FIXME: blocking test
  // test('sleep test with blocking', async () => {
  //   const time = 1500;
  //   const slack = 100;
  //   const studentImage = new StudentImage();
  //   const prototype = Object.getPrototypeOf(studentImage);
  //   const sleep = prototype.sleep;
  //   const start = Date.now();
  //   await sleep(time);
  //   const end = Date.now();
  //   expect(end - start).toBeLessThan(time + slack);
  //   expect(end - start).toBeGreaterThan(time - slack);
  // });

  // TODO
  test('sleep test without blocking', async () => {
    // const studentImage = new StudentImage();
    // const prototype = Object.getPrototypeOf(studentImage);
    // const sleep = prototype.sleep;
    // const start = Date.now();
    // jest.useFakeTimers();
    // jest.advanceTimersByTime(1000);
    // expect(setTimeout).toHaveBeenCalledTimes(1);
    // expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    //
  });

  test('should have only one method which is accessible from outside of instance', async () => {
    const studentImage = new StudentImage();
    expect(Object.keys(studentImage).length).toBe(0);
    expect(studentImage.downloadAll).toBeInstanceOf(Function);
  });

  test('should return url', async () => {
    const studentImage = new StudentImage();
    const prototype = Object.getPrototypeOf(studentImage);
    expect(prototype.url('08-123')).toBe('https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-123.jpg');
  });

  test('asynchronous call', async () => {
    const ksa = new Ksa();
    // FIXME: use ts-mockito to mock downloadAll method
    // https://jojoldu.tistory.com/638
    // const image = await ksa.students.image.downloadAll(20);
  });
});
