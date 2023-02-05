# Korea Science Academy

Utitlity library for KSA students

## Basic usage

```ts
import { Ksa } from 'korea-science-academy';

const ksa = new Ksa();
ksa.students.image.downloadAll({ year: 20 }); // download all student images for `20-xxx`
```

## Quick start

```sh
git clone https://github.com/thilllon/korea-science-academy.git ksa

cd ksa
npm install -g pnpm
pnpm install
pnpm build

cd example
pnpm install
pnpm dev
```
