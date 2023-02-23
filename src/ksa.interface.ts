import { KsaStudentImage } from './ksa-student-image';

export interface Student {
  image: KsaStudentImage;
}

export interface DownloadAllArg {
  year: number;
  sleepInMs?: number;
  numOfStudents?: number;
}

export interface IKsaStudentImage {
  getUrl(studentId: string): string;
  download({ studentId }: { studentId: string }): Promise<string | undefined>;
  downloadAll({ year, sleepInMs }: DownloadAllArg): Promise<string[]>;
}
