#!/bin/bash
########################################
# Create a file based on the environment variables
# given by the dockerc run -e parameter
########################################
cat <<EOF
# application
EXTENION_USAGE="${EXTENSION_USAGE}"
USERNAME="${USERNAME}"
PASSWORD="${PASSWORD}"
EOF