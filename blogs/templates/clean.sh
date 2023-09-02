#!/bin/zsh

template_dir=$(dirname -- "$(readlink -f -- "$0")")
target_dir=$(readlink -f -- "$template_dir/..")
target_dir="$target_dir/generated"

mkdir -p "$target_dir"

echo "Removing '$target_dir'..."
rm -r "$target_dir"

echo -e '\nCleaned!'
