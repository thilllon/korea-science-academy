import { StudentImage } from './student-image';
import { Student } from './ksa.interface';

export class Ksa {
  students: Student;

  constructor() {
    this.students = {
      image: new StudentImage(),
    };
  }
}
