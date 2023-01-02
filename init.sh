# --------------------------------
# setup
# --------------------------------
pnpm init
pnpm add -D typescript @types/node tsup
pnpm tsc --init

mkdir src
touch src/index.ts
echo 'node_modules
dist
.env*
!.env.example
' >>.gitignore

# --------------------------------
# package.json
# --------------------------------
npm pkg set 'license'='MIT'
npm pkg set 'packageManager'="pnpm@$(pnpm -v)"
npm pkg set 'main'='dist/index.js'
npm pkg set 'types'='dist/index.d.ts'
npm pkg set 'files'[]='dist'

npx npm-add-script -f -k "dev" -v "tsx src/index.ts"
npx npm-add-script -f -k "build" -v "tsup"
npx npm-add-script -f -k "build:tsc" -v "tsc"
npx npm-add-script -f -k "start" -v "dist/index.js"
npx npm-add-script -f -k "test" -v "jest"

# --------------------------------
# tsup
# https://tsup.egoist.dev/#typescript--javascript
# --------------------------------

echo 'import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
})' >tsup.config.ts

# --------------------------------
# commit, format, release
# --------------------------------

pnpm add -D husky lint-staged prettier commitlint @commitlint/config-conventional @commitlint/cli commitizen git-cz release-it

# husky https://typicode.github.io/husky/#/
pnpm dlx husky-init
npx npm-add-script --force --key "prepare" --value "husky install && chmod +x .husky/*"
pnpm install

# lint-staged https://github.com/okonet/lint-staged#configuration
echo 'echo "##  .husky/$(basename "$0") (node $(node -v))"' >>.husky/pre-commit
echo "pnpm lint-staged" >>.husky/pre-commit
# echo '{"./**/src/**/*": ["prettier -w -l", "eslint --fix"]}' >.lintstagedrc.json
npm pkg set "lint-staged.**/src/**/*"[]="prettier -w -l"
npm pkg set "lint-staged.**/src/**/*"[]="eslint --fix"

# commitizen https://github.com/commitizen/cz-cli
# echo '{"path": "cz-conventional-changelog"}' >.czrc
npm pkg set 'config.commitizen.path'='cz-conventional-changelog'

# commitlint https://github.com/conventional-changelog/commitlint
npx husky add .husky/commit-msg 'pnpm commitlint --edit $1'
echo 'echo "##  .husky/$(basename "$0") (node $(node -v))"' >>.husky/commit-msg
echo 'echo "##  .husky/$(basename "$0") (node $(node -v))"' >>.husky/prepare-commit-msg
# echo "module.exports = {extends: ['@commitlint/config-conventional']}" >commitlint.config.js
npm pkg set 'commitlint.extends'[]='@commitlint/config-conventional'

# prettier
# echo '{"printWidth": 100,"singleQuote": true}' >.prettierrc.json
npm pkg set 'prettier.printWidth'=100
npm pkg set 'prettier.singleQuote'=true

echo 'dist' >>.prettierignore
echo 'pnpm-lock.yaml' >>.prettierignore
npx npm-add-script --force --key "format" --value "prettier --write --list-different ."

# release-it https://github.com/release-it/release-it
npx npm-add-script --force --key "release" --value "pnpm format && pnpm lint && pnpm test && pnpm build && release-it"
# echo '{"git": {"commitMessage": "chore: release v${version}"},
#   "github": {"release": true}}' >.release-it.json
npm pkg set 'release-it.git.commitMessage'='chore: release v${version}'
npm pkg set 'release-it.github.release'=true

# format
pnpm format

# --------------------------------
# lint
# --------------------------------
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npx npm-add-script -f -k "lint" -v "eslint --fix ."

# --------------------------------
# github
# https://github.com/new
# --------------------------------

git branch -M main
# git remote add origin git@github.com:<OWNER>/<REPO>.git
# git push -u origin main
