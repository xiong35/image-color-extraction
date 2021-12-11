#!/bin/sh

yarn build
git add .
git commit -m"build"
npm version patch
npm publish