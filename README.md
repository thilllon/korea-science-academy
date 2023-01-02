# Korea Science Academy

## Basic Usage

```ts
import { KsaPicture } from 'korea-science-academy';

const ksaPicture = new KsaPicture();
ksaPicture.getKsaProfileImage(8); // e.g., 8 => 08-xxx, 11 => 11-xxx
```

## live demo

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
