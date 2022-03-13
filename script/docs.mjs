#!/usr/bin/env zx


await `set -e`
cd('packages/thgraph/docs/.vitepress/')
await $`pwd`
await $`rm -rf dist`
cd('../../');
await $`pwd`
await $`pnpm docs:build`
cd('./docs/.vitepress/dist/')
await $`git init`
await $`git add -A`
await $`git commit -m 'deploy'`
await $`git push -f git@github.com:wflixu/tgraph.git master:gh-pages`

cd('../')
await $`pwd`
await $`rm -rf dist`



