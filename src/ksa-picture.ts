import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class KsaPicture {
  // --------------------------------
  // scrape all KSA students profile images
  // https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/08-035.jpg
  // --------------------------------

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private saveFailure(year: string, tag: string) {
    const failurePath = path.join(process.cwd(), `KSA${year}`, 'failure.txt');
    if (fs.existsSync(failurePath)) {
      const data = fs.readFileSync(failurePath);
      const lines = data.toString().split('\r\n').join('\n').split('\n');
      if (lines.includes(tag)) {
        return;
      }
    }
    fs.writeFileSync(failurePath, `${tag}\n`, { flag: 'a' });
  }

  private async downloadImage(year: string, id: string) {
    const studentId = `${year}-${id}`;
    const url = `https://keis.ksa.hs.kr/uploadfiles/SCTSTUDENTN/${studentId}.jpg`;
    const filePath = path.join(process.cwd(), `KSA${year}`, `${studentId}.jpg`);
    try {
      if (fs.existsSync(filePath)) {
        return;
      }
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      fs.writeFileSync(filePath, base64, 'base64');
    } catch (err) {
      this.saveFailure(year, studentId);
    }
  }

  private clearFailure(year: string) {
    const failurePath = path.join(process.cwd(), `KSA${year}`, 'failure.txt');
    if (fs.existsSync(failurePath)) {
      const data = fs.readFileSync(failurePath);
      const lines = data.toString().split('\r\n').join('\n').split('\n');
      const newLines = lines.sort().filter((line) => {
        const imgPath = path.join(process.cwd(), `KSA${year}`, `${line}.jpg`);
        return !fs.existsSync(imgPath);
      });

      fs.writeFileSync(failurePath, newLines.join('\n'), { flag: 'w' });
    }
  }

  async getKsaProfileImage(yearNumber: number, sleepTime = 300) {
    const year = String(yearNumber).padStart(2, '0');

    for (let idNumber = 1; idNumber <= 144; idNumber++) {
      const id = String(idNumber).padStart(3, '0');
      const folderPath = path.join(process.cwd(), `KSA${year}`);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      await this.downloadImage(year, id);
      await this.sleep(sleepTime);
    }
    await this.sleep(sleepTime);
    this.clearFailure(year);
  }
}
