#!/usr/bin/env sh

set -eu

out_dir='./dist'
templates_dir='./src/templates'

rm -rf $out_dir
ncc build ./index.ts -o $out_dir --minify --no-cache --no-source-map-register
cp -r $templates_dir $out_dir
