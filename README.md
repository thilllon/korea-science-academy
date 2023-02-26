# Korea Science Academy

Utitlity library for KSA students

## Basic usage

See [`./example/index.ts`](./example/index.ts)

```ts
const ksa = new Ksa();

const url = ksa.students.image.getUrl('11-001');

console.log('Profile image of 11-001:', url);

ksa.students.image.download({ studentId: '12-001' });

ksa.students.image.downloadAll({ year: 2013 });
```

## Quick start

```sh
git clone https://github.com/thilllon/korea-science-academy.git ksa
cd ksa
pnpm install
pnpm build

cd example
pnpm install
pnpm dev
```
