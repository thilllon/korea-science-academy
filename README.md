# Korea Science Academy

## Basic usage

```ts
import { Ksa } from 'korea-science-academy';

const ksa = new Ksa();
ksa.students.image.get({ id: '08-100' }); // e.g., 8 => 08-xxx, 11 => 11-xxx
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
