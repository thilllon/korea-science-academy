import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { lastValueFrom, map, of, retry } from 'rxjs';
import z from 'zod';
import { DownloadAllArg, DownloadArg, IKsaStudentImage } from './ksa.interface';

export class KsaStudentImage implements IKsaStudentImage {
  // --------------------------------
  // scrape all KSA students profile images
  // https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-035.jpg
  // --------------------------------

  private failLogFile;
  private totalStudents;
  private delay;

  constructor({
    logFile,
    totalStudents,
    delay,
  }: { logFile?: string; totalStudents?: number; delay?: number } = {}) {
    this.failLogFile = logFile ?? `${new Date().getTime()}.log`;
    this.totalStudents = totalStudents ?? 144;
    this.delay = delay ?? 300;
  }

  /**
   * Get URL of a student image
   */
  getUrl(studentId: string) {
    // 144 students in a year by default
    const validStudentId = z
      .string()
      .regex(/^[0-9]{2}-[0-9]{3}$/)
      .parse(studentId);

    const url = `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${validStudentId}.jpg`;
    return url;
  }

  async download({ studentId }: DownloadArg) {
    const [yearChunk, studentNumber] = studentId.split('-');
    return this.downloadImage(yearChunk, studentNumber);
  }

  /**
   * Download all images of KSA students in a year
   */
  async downloadAll({ year, delay = this.delay, total = this.totalStudents }: DownloadAllArg) {
    if (!year) {
      throw new Error('year is required');
    }

    console.log('year', year);

    // else if (year < 1999) {
    //   throw new Error('year must be greater than 1999');
    // }

    const downloadedList: string[] = [];
    const yearChunk = year.toString().slice(-2);

    for (let num = 1; num <= total; num++) {
      const digits = total.toString().length;
      const numString = String(num).padStart(digits, '0');
      const folderPath = join(process.cwd(), `KSA${yearChunk}`);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      const url = await this.downloadImage(yearChunk, numString);
      if (url) {
        downloadedList.push(url);
      }
      await this.sleep(delay);
    }
    await this.sleep(delay);
    this.removeFailed(yearChunk);

    return downloadedList;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private saveFailed(year: string, studentId: string) {
    try {
      const logFile = this.failLogFile || 'fail.log';

      const logFilePath = join(process.cwd(), `KSA${year}`, logFile);
      if (existsSync(logFilePath)) {
        const data = readFileSync(logFilePath);
        const lines = data.toString().split('\r\n').join('\n').split('\n');
        if (lines.includes(studentId)) {
          return;
        }
      }
      writeFileSync(logFilePath, `${studentId}\n`, { flag: 'a' });
    } catch (err) {
      console.error(err);
    }
  }

  private downloadImageObservable(yearChunk: string, studentNumber: string) {
    const defaultRetry = 3;
    const img$ = of(studentNumber).pipe(
      map((studentNumber) => this.downloadImage(yearChunk, studentNumber)),
      retry(defaultRetry)
    );

    return lastValueFrom(img$);
  }

  private async downloadImage(yearChunk: string, studentNumber: string) {
    const studentId = `${yearChunk}-${studentNumber}`;
    const url = this.getUrl(studentId);
    const filePath = join(process.cwd(), `KSA${yearChunk}`, `${studentId}.jpg`);
    try {
      if (existsSync(filePath)) {
        return url;
      }
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64Encoded = Buffer.from(response.data, 'binary').toString('base64');
      writeFileSync(filePath, base64Encoded, 'base64');
    } catch (err) {
      this.saveFailed(yearChunk, studentId);
    }

    return url;
  }

  private removeFailed(year: string) {
    const logFile = this.failLogFile || 'fail.log';

    const logFilePath = join(process.cwd(), `KSA${year}`, logFile);
    if (!existsSync(logFilePath)) {
      return [];
    }
    const data = readFileSync(logFilePath);
    const lines = data.toString().split('\r\n').join('\n').split('\n');
    const filtered = lines.sort().filter((line) => {
      const imgPath = join(process.cwd(), `KSA${year}`, `${line}.jpg`);
      return !existsSync(imgPath);
    });

    writeFileSync(logFilePath, filtered.join('\n'), { flag: 'w' });
    return filtered;
  }
}
