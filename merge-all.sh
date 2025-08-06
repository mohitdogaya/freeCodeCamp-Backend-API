#!/bin/bash

# List of repos and their target folders
declare -A repos
repos=(
  [filemeta]="https://github.com/mohitdogaya/File-Meta-Data.git"
  [exercisetracker]="https://github.com/mohitdogaya/Exercise-Tracker.git"
  [urlshortener]="https://github.com/mohitdogaya/URL-Shortener-Microservice.git"
  [headerparser]="https://github.com/mohitdogaya/Request-Header-Parser-Microservice.git"
  [timestamp]="https://github.com/mohitdogaya/Timestamp-Microservice.git"
)

for remote in "${!repos[@]}"; do
  folder_name=""
  case $remote in
    filemeta) folder_name="File-Meta-Data" ;;
    exercisetracker) folder_name="Exercise-Tracker" ;;
    urlshortener) folder_name="URL-Shortener-Microservice" ;;
    headerparser) folder_name="Request-Header-Parser-Microservice" ;;
    timestamp) folder_name="Timestamp-Microservice" ;;
  esac

  echo "🔄 Merging $folder_name..."

  # Clean any old remote with the same name
  git remote remove $remote 2> /dev/null

  # Add and fetch remote
  git remote add $remote "${repos[$remote]}"
  git fetch $remote

  # Create a new folder and checkout contents there
  git read-tree --prefix="$folder_name/" -u "$remote/main"

  echo "✅ Done: $folder_name"
  echo "----------------------------"
done
