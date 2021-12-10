#!/bin/sh

yarn build
npm version patch
npm publish