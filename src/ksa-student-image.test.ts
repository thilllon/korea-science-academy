import { beforeEach, describe, expect, test } from '@jest/globals';
import { KsaStudentImage } from './ksa-student-image';

describe('KsaStudentImage', () => {
  let ksaStudentImage: KsaStudentImage;

  beforeEach(() => {
    ksaStudentImage = new KsaStudentImage();
  });

  test('getUrl', () => {
    expect(ksaStudentImage.getUrl).toBeInstanceOf(Function);
  });

  test('getUrl: valid studentId', () => {
    const validStudentIdsFixture = ['08-123', '09-123', '10-001'];

    for (const studentId of validStudentIdsFixture) {
      expect(ksaStudentImage.getUrl(studentId)).toBe(
        `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${studentId}.jpg`
      );
    }
  });

  test('getUrl: invalid studentId', () => {
    const invalidStudentIdsFixture = ['20-0000', '008-123'];
    // debugger;
    for (const studentId of invalidStudentIdsFixture) {
      expect(() => ksaStudentImage.getUrl(studentId)).toThrow();
    }
  });

  test('downloadAll', async () => {
    const ksaStudentImage = new KsaStudentImage();
    expect(Object.keys(ksaStudentImage).length).toBe(0);
    expect(ksaStudentImage.downloadAll).toBeInstanceOf(Function);

    // FIXME: spyOn
    // const downloadSpy = jest.spyOn(ksaStudentImage, 'download');
    // await ksaStudentImage.downloadAll({ year: 2020 });
    // expect(downloadSpy).toHaveBeenCalledTimes(144);

    // const downloadSpy = jest.spyOn(ksaStudentImage, 'download');
    // ksaStudentImage.download = jest
    //   .fn<any>()
    //   .mockImplementation(({ studentId }: { studentId: string }) => {
    //     return ('file://' + studentId) as any;
    //   }) as any;

    // const downloadedList = await ksaStudentImage.downloadAll({ year: 2021 });
    // expect(downloadedList.length).toBe(144);
  });

  // FIXME: blocking test
  test('sleep test with blocking', async () => {
    // jest.spyOn(ksa);
    // const time = 1500;
    // const slack = 100;
    // const studentImage = new StudentImage();
    // const prototype = Object.getPrototypeOf(studentImage);
    // const sleep = prototype.sleep;
    // const start = Date.now();
    // await sleep(time);
    // const end = Date.now();
    // expect(end - start).toBeLessThan(time + slack);
    // expect(end - start).toBeGreaterThan(time - slack);
  });

  test('sleep test without blocking', async () => {
    // const studentImage = new StudentImage();
    // const prototype = Object.getPrototypeOf(studentImage);
    // const sleep = prototype.sleep;
    // const start = Date.now();
    // jest.useFakeTimers();
    // jest.advanceTimersByTime(1000);
    // expect(setTimeout).toHaveBeenCalledTimes(1);
    // expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
