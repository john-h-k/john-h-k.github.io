#!/bin/zsh

template_dir=$(dirname -- "$(readlink -f -- "$0")")
target_dir=$(readlink -f -- "$template_dir/..")
target_dir="$target_dir/generated"

mkdir -p "$target_dir"

echo "Reading templates from '$template_dir' and generating into '$target_dir'"

for file in $(fd . "$template_dir" --extension md); do
  full_name=$(realpath --relative-to "$template_dir" -- "$file")
  output_name="$target_dir/${full_name%.md}.html"
  echo "$(dirname -- "$output_name")"
  mkdir -p "$(dirname -- "$output_name")"
  
  echo -e "Processing '$full_name' into '$output_name'\n"

  jq --slurp --raw-input  '{"text": "\(.)", "mode": "markdown"}' < "$file" \
    | curl --silent --data @- https://api.github.com/markdown > "$output_name"
done
