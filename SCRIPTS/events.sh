#!/bin/bash

input_file="$1"

awk -F'=' '
BEGIN {
  print "export const events = ["
  first_event = 1
}

# Skip completely empty lines
NF == 0 { next }

{
  key   = $1
  sub(/^[ \t]+|[ \t]+$/, "", key)
  value = $0
  sub(/^[^=]*=/, "", value)
  sub(/^[ \t]+|[ \t]+$/, "", value)

  if (key == "Name") {
    if (!first_event) {
      print "\n  },"
    }
    first_event = 0
    printf "  {\n    \"%s\": \"%s\"", key, value
  } else { 
    printf ",\n    \"%s\": \"%s\"", key, value
  }
}

END {
  if (!first_event) {
    print "\n  }"
  }
  print "]"
}' "$input_file"
