npm pkg set 'license'='MIT'
npm pkg set 'packageManager'="pnpm@$(pnpm -v)"
npm pkg set 'main'='dist/index.js'
npm pkg set 'types'='dist/index.d.ts'
npm pkg set 'files'[]='dist'

npm pkg set "lint-staged.**/src/**/*"[]="prettier -w -l"
npm pkg set "lint-staged.**/src/**/*"[]="eslint --fix"

npm pkg set 'config.commitizen.path'='cz-conventional-changelog'

npm pkg set 'commitlint.extends'[]='@commitlint/config-conventional'

npm pkg set 'prettier.printWidth'=100
npm pkg set 'prettier.singleQuote'=true

npm pkg set 'release-it.git.commitMessage'='chore: release v${version}'
npm pkg set 'release-it.github.release'=true
