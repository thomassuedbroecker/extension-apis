#!/bin/bash

CURRENT_USER=$(whoami)
echo "Current user: $CURRENT_USER"

echo "*********************"
echo "** Verify enviroment values"
echo "*********************"

# application
echo "EXTENSION_USAGE: ${EXTENSION_USAGE}"

echo "*********************"
echo "** Create enviroment file "
echo "*********************"

"/bin/sh" ./generate_env-config.sh > ./.env
more .env

echo "*********************"
echo "** Start server"
echo "*********************"

ls 

node server.js
echo "npm start - doesn't work at the moment on openshift"