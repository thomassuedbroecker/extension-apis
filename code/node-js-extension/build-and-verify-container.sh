#!/bin/bash

# **************** Global variables
export ROOT_PATH=$(pwd)
export CONTAINER_NAME=extension-verification
export IMAGE_NAME=extension-local-verification:v3
export CONTAINER_RUNTIME=podman

# **************** Verify container
echo "************************************"
echo " Verify container locally"
echo "************************************"

echo "************************************"
echo " Build and run extension example"
echo "************************************"

$CONTAINER_RUNTIME image list
$CONTAINER_RUNTIME container list
$CONTAINER_RUNTIME container stop -f $CONTAINER_NAME
$CONTAINER_RUNTIME container rm -f $CONTAINER_NAME
$CONTAINER_RUNTIME image rm -f $IMAGE_NAME

$CONTAINER_RUNTIME build -t $IMAGE_NAME -f Dockerfile .

$CONTAINER_RUNTIME container list

$CONTAINER_RUNTIME run --name=$CONTAINER_NAME \
           -it \
           -e EXTENSION_USAGE="local extension" \
           -e USERNAME="admin" \
           -e PASSWORD="admin" \
           -p 3000:3000 \
           $IMAGE_NAME

$CONTAINER_RUNTIME port --all 