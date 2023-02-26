import { Ksa } from '../src/ksa';

const ksa = new Ksa();

const url = ksa.students.image.getUrl('11-001');

console.log('Profile image of 11-001:', url);

ksa.students.image.download({ studentId: '12-001' });

ksa.students.image.downloadAll({ year: 2013 }); // download all student images for `13-xxx`
