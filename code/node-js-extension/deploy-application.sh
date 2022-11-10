#!/bin/bash

# CLI Documentation
# ================
# command documentation: https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli#cli-application-create

# **************** Global variables

echo "Name for the project: $MYPROJECT"

export ROOT_FOLDER=$ROOTFOLDER
export PROJECT_NAME=$MYPROJECT
export RESOURCE_GROUP=${RESOURCE_GROUP:-default}
export REGION=${REGION:-us-south}
export REGISTRY="quay.io"
export REPOSITORY=tsuedbroecker

export NAMESPACE=""
export ASSISTANT_EXTENSION_URL=""

export STATUS="Running"

export COMMONTAG="v0.0.3"
export EXTENSION_IMAGE="$REGISTRY/$REPOSITORY/nodejs-assistant-extension:$COMMONTAG"

# **********************************************************************************
# Functions definition
# **********************************************************************************

function setupCLIenvCE() {
  echo "**********************************"
  echo " Using following project: $PROJECT_NAME" 
  echo "**********************************"
  
  ibmcloud target -g $RESOURCE_GROUP -r $REGION
  
  echo "Project name: $PROJECT_NAME"
  ibmcloud ce project create --name $PROJECT_NAME
  ibmcloud ce project get --name $PROJECT_NAME
  ibmcloud ce project select -n $PROJECT_NAME
  
  #to use the kubectl commands
  ibmcloud ce project select -n $PROJECT_NAME --kubecfg
  
  NAMESPACE=$(ibmcloud ce project get --name $PROJECT_NAME --output json | grep "namespace" | awk '{print $2;}' | sed 's/"//g' | sed 's/,//g')
  echo "Namespace: $NAMESPACE"
  kubectl get pods -n $NAMESPACE

  CHECK=$(ibmcloud ce project get -n $PROJECT_NAME | awk '/Apps/ {print $2;}')
  echo "**********************************"
  echo "Check for existing apps? '$CHECK'"
  echo "**********************************"
  if [ $CHECK != 0 ];
  then
    echo "Error: There are remaining '$CHECK' apps."
    echo "Wait until all apps are deleted inside the $PROJECT_NAME."
    echo "The script exits here!"
    exit 1
  fi
 
}

function createSecrets() {
    
    ibmcloud ce secret create --name application.user --from-literal "USER=admin"
    ibmcloud ce secret create --name application.password --from-literal "PASSWORD=admin"

}

# **** application and microservices ****

function deployExtension(){

    ibmcloud ce application create --name assistant-extension --image "$EXTENSION_IMAGE" \
                                   --cpu "0.5" \
                                   --memory "1G" \
                                   --env EXTENSION_USAGE="code-engine usage" \
                                   --env-from-secret application.user \
                                   --env-from-secret application.password \
                                   --max-scale 1 \
                                   --min-scale 0 \
                                   --concurrency-target 10 \
                                   --port 3000                                       
    
    ibmcloud ce application get --name assistant-extension
    
    # Change autoscaling for articles configuration

    kn service update assistant-extension --annotation-revision autoscaling.knative.dev/scaleToZeroPodRetentionPeriod=5m
    ibmcloud ce application get --name assistant-extension -o json > temp-assistant-extension.json
    CURRENT_CONFIG=$(cat ./temp-assistant-extension.json| jq '.status.latestReadyRevisionName' | sed 's/"//g')
    echo "Current config: $CURRENT_CONFIG"
    rm temp-assistant-extension.json
    kn revision describe $CURRENT_CONFIG --verbose

    ASSISTANT_EXTENSION_URL=$(ibmcloud ce application get --name assistant-extension -o url)
}

# **** Kubernetes CLI ****

function kubeDeploymentVerification(){
    echo "************************************"
    echo " pods, deployments and configmaps details "
    echo "************************************"
    
    kubectl get pods -n $NAMESPACE
    kubectl get deployments -n $NAMESPACE
    kubectl get configmaps -n $NAMESPACE
}

function getKubeContainerLogs(){
    echo "************************************"
    echo " assistant-extension log"
    echo "************************************"

    FIND=assistant-extension
    ASSISTANT_EXTENSION_LOG=$(kubectl get pod -n $NAMESPACE | grep $FIND | awk '{print $1}')
    echo $ASSISTANT_EXTENSION_LOG
    kubectl logs $ASSISTANT_EXTENSION
}

function createOpenAPIspecification(){
  JSON_FORMAT_TEMPLATE=assistant-extension.json-template
  JSON_FORMAT=assistant-extension.json
  YAML_FORMAT_TEMPLATE=assistant-extension.yaml-template
  YAML_FORMAT=assistant-extension.yaml

  sed "s+CODE_ENGINE_APPLICATION_URL+$ASSISTANT_EXTENSION_URL+g" "$ROOT_FOLDER/$JSON_FORMAT_TEMPLATE" > "$ROOT_FOLDER/$JSON_FORMAT"
  sed "s+CODE_ENGINE_APPLICATION_URL+$ASSISTANT_EXTENSION_URL+g" "$ROOT_FOLDER/$YAML_FORMAT_TEMPLATE" > "$ROOT_FOLDER/$YAML_FORMAT"
}

# **********************************************************************************
# Execution
# **********************************************************************************

echo "************************************"
echo " CLI config"
echo "************************************"

setupCLIenvCE

echo "************************************"
echo " create secrets"
echo "************************************"

createSecrets

echo "************************************"
echo " assistant extension"
echo "************************************"

deployExtension
ibmcloud ce application events --application assistant-extension

echo "************************************"
echo " Verify deployments"
echo "************************************"

kubeDeploymentVerification

echo "************************************"
echo " Container logs"
echo "************************************"

getKubeContainerLogs

echo "************************************"
echo " Create OpenAPI specification"
echo "************************************"

createOpenAPIspecification

echo "************************************"
echo " URLs"
echo "************************************"
echo " - Extension  : $ASSISTANT_EXTENSION_URL"