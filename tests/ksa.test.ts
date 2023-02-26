import { describe, expect, it } from '@jest/globals';
import { Ksa } from '../src/ksa';
import { KsaStudentImage } from '../src/ksa-student-image';

describe('Ksa', () => {
  it('should initialize students property with an image object', () => {
    const ksa = new Ksa();
    expect(ksa.students.image).toBeInstanceOf(KsaStudentImage);
  });
});
