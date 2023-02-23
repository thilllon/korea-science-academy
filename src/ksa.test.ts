import { describe, expect, it } from '@jest/globals';
import { KsaStudentImage } from './ksa-student-image';
import { Ksa } from './ksa';

describe('Ksa', () => {
  it('should initialize students property with an image object', () => {
    const ksa = new Ksa();
    expect(ksa.students.image).toBeInstanceOf(KsaStudentImage);
  });
});
