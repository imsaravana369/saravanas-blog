#!/bin/bash

# Step 1: Traverse over all directories containing an index.md file
for dir in */; do
    if [ -f "$dir/index.md" ]; then
        # Step 2: Extract the directory name as the title
        title=$(basename "$dir")

        # Step 3: Create a temporary file to hold the modified front matter
        tmpfile=$(mktemp)

        # Step 4: Read the existing index.md file line by line
        while IFS= read -r line; do
            # Check if the line contains 'date ='
            if [[ "$line" == "date = "* ]]; then
                # Replace the existing date line with a new one (modify as needed)
                echo "date = '2023-10-02T13:50:39+05:30'" >> "$tmpfile"
            else
                # Copy other lines as is
                echo "$line" >> "$tmpfile"
            fi
        done < "$dir/index.md"

        # Step 5: Replace the old index.md with the modified one
        mv "$tmpfile" "$dir/index.md"

        # Step 6: Clean up the temporary file
        rm "$tmpfile"
    fi
done

