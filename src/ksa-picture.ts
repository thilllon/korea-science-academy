import axios from 'axios';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class KsaPicture {
  // --------------------------------
  // scrape all KSA students profile images
  // https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-035.jpg
  // --------------------------------

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

  private async downloadImage(year: string, id: string) {
    const studentId = `${year}-${id}`;
    const url = `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${studentId}.jpg`;
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

  async getKsaProfileImage(yearNumber: number, sleepTime = 300) {
    const year = String(yearNumber).padStart(2, '0');

    for (let idNumber = 1; idNumber <= 144; idNumber++) {
      const id = String(idNumber).padStart(3, '0');
      const folderPath = join(process.cwd(), `KSA${year}`);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      await this.downloadImage(year, id);
      await this.sleep(sleepTime);
    }
    await this.sleep(sleepTime);
    this.removeFailure(year);
  }
}
