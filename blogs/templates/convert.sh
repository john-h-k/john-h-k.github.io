
template_dir=$(dirname -- "$(readlink -f -- "$0")")
target_dir=$(readlink -f -- "$template_dir/..")

echo "Reading templates from '$template_dir' and generating into '$target_dir'"

for file in $(fd . "$template_dir" --extension md); do
  full_name=$(realpath --relative-to "$template_dir" "$file")
  jq --slurp --raw-input  '{"text": "\(.)", "mode": "markdown"}' < "$file" \
    | curl --data @- https://api.github.com/markdown > "$target_dir/${full_name%.md}.html"
done
