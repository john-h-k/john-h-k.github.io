#!/bin/zsh

template_dir=$(dirname -- "$(readlink -f -- "$0")")
target_dir=$(readlink -f -- "$template_dir/..")
target_dir="$target_dir/generated"

mkdir -p "$target_dir"

echo "Reading templates from '$template_dir' and generating into '$target_dir'"

for file in $(fd . "$template_dir" --extension md); do
  # macOS Ventura added a new `realpath` command which doesn't support `--relative-to`
  # full_name=$(realpath --relative-to "$template_dir" -- "$file")
  # instead we use zsh param expansion
  full_name=${file#"$template_dir/"}
  title="${full_name%.md}"
  output_name="$target_dir/$title.html"

  echo "$(dirname -- "$output_name")"
  mkdir -p "$(dirname -- "$output_name")"

  cp "$template_dir/skeleton.html" "$output_name"
  
  echo -e "Processing '$full_name' into '$output_name'\n"

  tail -n +2 < "$file" | jq --slurp --raw-input  '{"text": "\(.)", "mode": "gfm"}'\
    | gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        --input - \
        /markdown \
      > "$output_name.tmp"
  
  title="$(head -1 "$file" | sed 's/^ *# *//')"
  escaped_title="$(printf '%q' "$title")"
  content="$(cat "$output_name.tmp" | tr -d '\n')"

  gsed -i "s/\[\[TITLE\]\]/$escaped_title/g" "$output_name"
  gsed -i "/[[BODY]]/{
    r $output_name.tmp
    d
  }" "$output_name"

  rm "$output_name.tmp"
done
