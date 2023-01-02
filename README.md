# Korea Science Academy

## Basic usage

```ts
import { KsaPicture } from 'korea-science-academy';

const ksaPicture = new KsaPicture();
ksaPicture.getKsaProfileImage(8); // e.g., 8 => 08-xxx, 11 => 11-xxx
```

## Live demo

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
