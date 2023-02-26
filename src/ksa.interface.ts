import { KsaStudentImage } from './ksa-student-image';

export interface Student {
  image: KsaStudentImage;
}

export interface DownloadArg {
  /**
   * student ID e.g., 08-035
   */
  studentId: string;
}

export interface DownloadAllArg {
  /**
   * year of entrance. e.g., '2011', '2012', '2013', ...
   */
  year: number;
  /**
   * sleep time in milliseconds. Default: 300
   */
  delay?: number;
  /**
   * number of students in a year. Default: 144
   */
  total?: number;
}

export interface IKsaStudentImage {
  getUrl(studentId: string): string;
  download(arg: DownloadArg): Promise<string | undefined>;
  downloadAll(arg: DownloadAllArg): Promise<string[]>;
}
