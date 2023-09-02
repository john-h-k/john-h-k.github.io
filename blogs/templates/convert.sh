#!/bin/zsh

template_dir=$(dirname -- "$(readlink -f -- "$0")")
target_dir=$(readlink -f -- "$template_dir/..")
target_dir="$target_dir/generated"

mkdir -p "$target_dir"

echo "Reading templates from '$template_dir' and generating into '$target_dir'"

for file in $(fd . "$template_dir" --extension md); do
  full_name=$(realpath --relative-to "$template_dir" -- "$file")
  title="${full_name%.md}"
  output_name="$target_dir/$title.html"

  echo "$(dirname -- "$output_name")"
  mkdir -p "$(dirname -- "$output_name")"

  cp "$template_dir/skeleton.html" "$output_name"
  
  echo -e "Processing '$full_name' into '$output_name'\n"

  jq --slurp --raw-input  '{"text": "\(.)", "mode": "markdown"}' < "$file" \
    | gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        --input - \
        /markdown \
      > "$output_name.tmp"
  
    # | curl --silent --data @- https://api.github.com/markdown > "$output_name.tmp"

  content=$(cat "$output_name.tmp" | tr -d '\n')
  gsed -i "/[[BODY]]/{
    r $output_name.tmp
    d
  }" "$output_name"
  # sed -i '' "s/[[BODY]]/$content/" "$output_name"
  # awk 'BEGIN{getline l < "$output_name.tmp"}/\[\[BODY\]\]/{gsub("[[BODY]]",l)}1' "$output_name"
  rm "$output_name.tmp"
done
