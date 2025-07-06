#!/bin/bash

# Set your start date
start_date="2025-06-28"
current_date=$(date -I -d "$start_date")
hour=10

# Get the list of commits (oldest first)
commits=($(git rev-list --reverse HEAD))

# Loop over commits
for i in "${!commits[@]}"; do
    commit="${commits[$i]}"

    # Calculate day offset: one day every ~7 commits
    day_offset=$((i / 7))
    new_date=$(date -I -d "$start_date +$day_offset day")

    # Set hour between 10 and 17 (working hours look)
    random_hour=$((10 + (i % 8)))
    random_minute=$(((i * 7) % 60))

    full_date="${new_date}T${random_hour}:$(printf "%02d" $random_minute):00"

    # Rewrite commit date
    GIT_COMMITTER_DATE="$full_date" git commit --amend --no-edit --date "$full_date" --allow-empty

    echo "Rewrote commit $commit to date $full_date"

    git rebase --continue || break
done
