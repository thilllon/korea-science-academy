import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { KsaStudentImage } from '../src/ksa-student-image';

describe('KsaStudentImage', () => {
  let ksaStudentImage: KsaStudentImage;

  beforeEach(() => {
    ksaStudentImage = new KsaStudentImage();
  });

  afterAll(() => {
    console.log('done');
  });

  test('public methods', () => {
    expect(Object.keys(ksaStudentImage).length).toBe(3);
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
    for (const studentId of invalidStudentIdsFixture) {
      expect(() => ksaStudentImage.getUrl(studentId)).toThrow();
    }
  });

  test('downloadAll', async () => {
    const ksaStudentImage = new KsaStudentImage();
    expect(() => ksaStudentImage.downloadAll).toBeInstanceOf(Function);
  });

  test('downloadAll: given valid input', async () => {
    // FIXME: use spyOn
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

  test('downloadAll: given invalid input', () => {
    // FIXME: error
    // expect(() => ksaStudentImage.downloadAll({ year: 13 })).toThrow(
    //   'year must be greater than 1999'
    // );
    // error: {Symbol(async_id_symbol): 1847, Symbol(trigger_async_id_symbol): 1835}
    // expect(ksaStudentImage.downloadAll({ year: 13 })).toBe([]);
    // error: [Function Anonymous]
    // expect(ksaStudentImage.downloadAll({ year: 13 })).toBe([]);
  });

  test('sleep test with blocking', async () => {
    // TODO: test that sleep function blocks the execution for the given time
  });

  test('sleep test without blocking', async () => {
    // TODO: test if set delay time as 0 then there is no delay
  });
});
