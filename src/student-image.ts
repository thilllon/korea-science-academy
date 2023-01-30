import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import z from 'zod';

export class StudentImage {
  // --------------------------------
  // scrape all KSA students profile images
  // https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-035.jpg
  // --------------------------------

  async download({ studentId }: { studentId: string }) {
    const [year, num] = studentId.split('-');
    const url = await this.downloadImage(year, num);
    return url;
  }

  async downloadAll({ year, sleepInMs = 300 }: { year: number; sleepInMs?: number }) {
    const yearString = String(year).padStart(2, '0');

    for (let num = 1; num <= 144; num++) {
      const numString = String(num).padStart(3, '0');
      const folderPath = join(process.cwd(), `KSA${yearString}`);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      const url = await this.downloadImage(yearString, numString);
      await this.sleep(sleepInMs);
    }
    await this.sleep(sleepInMs);
    this.removeFailure(yearString);
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private saveFailure(year: string, tag: string) {
    const failurePath = join(process.cwd(), `KSA${year}`, 'failure.txt');
    if (existsSync(failurePath)) {
      const data = readFileSync(failurePath);
      const lines = data.toString().split('\r\n').join('\n').split('\n');
      if (lines.includes(tag)) {
        return;
      }
    }
    writeFileSync(failurePath, `${tag}\n`, { flag: 'a' });
  }

  private url(studentId: string) {
    const valid = z
      .string()
      .regex(/^[0-9]{2}-[0-9]{3}$/)
      .parse(studentId);

    const url = `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${studentId}.jpg`;
    return url;
  }

  private async downloadImage(year: string, num: string) {
    const studentId = `${year}-${num}`;
    const url = this.url(studentId);
    const filePath = join(process.cwd(), `KSA${year}`, `${studentId}.jpg`);
    try {
      if (existsSync(filePath)) {
        return;
      }
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64Encoded = Buffer.from(response.data, 'binary').toString('base64');
      writeFileSync(filePath, base64Encoded, 'base64');
    } catch (err) {
      this.saveFailure(year, studentId);
    } finally {
      return url;
    }
  }

  private removeFailure(year: string) {
    const failurePath = join(process.cwd(), `KSA${year}`, 'failure.txt');
    if (!existsSync(failurePath)) {
      return [];
    }
    const data = readFileSync(failurePath);
    const lines = data.toString().split('\r\n').join('\n').split('\n');
    const filtered = lines.sort().filter((line) => {
      const imgPath = join(process.cwd(), `KSA${year}`, `${line}.jpg`);
      return !existsSync(imgPath);
    });

    writeFileSync(failurePath, filtered.join('\n'), { flag: 'w' });
    return filtered;
  }
}
