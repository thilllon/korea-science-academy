import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import z from 'zod';
import { DownloadAllArg, IKsaStudentImage } from './ksa.interface';

export class KsaStudentImage implements IKsaStudentImage {
  // --------------------------------
  // scrape all KSA students profile images
  // https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-035.jpg
  // --------------------------------

  getUrl(studentId: string) {
    const validStudentId = z
      .string()
      .regex(/^[0-9]{2}-[0-9]{3}$/)
      .parse(studentId);

    const url = `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${validStudentId}.jpg`;
    return url;
  }

  async download({ studentId }: { studentId: string }) {
    const [year, num] = studentId.split('-');
    const url = await this.downloadImage(year, num);
    return url;
  }

  /**
   * Download all images of KSA students in a year
   * @param year e.g., 2011, 2012, 2013, ...
   * @param sleepInMs sleep time in milliseconds
   */
  async downloadAll({ year, sleepInMs = 300, numOfStudents = 144 }: DownloadAllArg) {
    if (!year) {
      throw new Error('year is required');
    }

    const downloadedList: string[] = [];

    const yearString = year.toString().slice(-2);

    for (let num = 1; num <= numOfStudents; num++) {
      const digits = numOfStudents.toString().length;
      const numString = String(num).padStart(digits, '0');
      const folderPath = join(process.cwd(), `KSA${yearString}`);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      const url = await this.downloadImage(yearString, numString);
      if (url) {
        downloadedList.push(url);
      }
      await this.sleep(sleepInMs);
    }
    await this.sleep(sleepInMs);
    this.removeFailed(yearString);

    return downloadedList;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private saveFailed(year: string, tag: string) {
    const logFile = 'fail.log';

    const logFilePath = join(process.cwd(), `KSA${year}`, logFile);
    if (existsSync(logFilePath)) {
      const data = readFileSync(logFilePath);
      const lines = data.toString().split('\r\n').join('\n').split('\n');
      if (lines.includes(tag)) {
        return;
      }
    }
    writeFileSync(logFilePath, `${tag}\n`, { flag: 'a' });
  }

  private async downloadImage(year: string, studentNumber: string) {
    const studentId = `${year}-${studentNumber}`;
    const url = this.getUrl(studentId);
    const filePath = join(process.cwd(), `KSA${year}`, `${studentId}.jpg`);
    try {
      if (existsSync(filePath)) {
        return;
      }
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64Encoded = Buffer.from(response.data, 'binary').toString('base64');
      writeFileSync(filePath, base64Encoded, 'base64');
    } catch (err) {
      this.saveFailed(year, studentId);
    } finally {
      return url;
    }
  }

  private removeFailed(year: string) {
    const logFile = 'fail.log';

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
