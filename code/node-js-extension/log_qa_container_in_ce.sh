#!/bin/bash

# **************** Global variables
source ./.env

export RESOURCE_GROUP=${RESOURCE_GROUP:-default}
export REGION=${REGION:-us-south}
export CE_APP_NAME="assistant-extension"
export CE_PROJECT_NAMESPACE=$MYPROJECT

# **********************************************************************************
# Functions definition
# **********************************************************************************

function set_target () {
    
    ibmcloud target -r $REGION
    ibmcloud target -g $RESOURCE_GROUP
}

function setup_ce_project() {
  echo "**********************************"
  echo " Using following project: $CE_PROJECT_NAME" 
  echo "**********************************"

  ibmcloud ce project select -n $CE_PROJECT_NAME
  
  #to use the kubectl commands
  ibmcloud ce project select -n $CE_PROJECT_NAME --kubecfg
  
  CE_PROJECT_NAMESPACE=$(ibmcloud ce project get --name $CE_PROJECT_NAME --output json | grep "namespace" | awk '{print $2;}' | sed 's/"//g' | sed 's/,//g')
  echo "Code Engine project namespace: $CE_PROJECT_NAMESPACE"
  kubectl get pods -n $CE_PROJECT_NAMESPACE
}

# **** Kubernetes CLI ****

function kube_information(){

    echo "************************************"
    echo " Kubernetes info '$CE_APP_NAME': pods, deployments and configmaps details "
    echo "************************************"
    
    kubectl get pods -n $CE_PROJECT_NAMESPACE
    kubectl get deployments -n $CE_PROJECT_NAMESPACE
    kubectl get configmaps -n $CE_PROJECT_NAMESPACE

}

function kube_pod_log(){

    echo "************************************"
    echo " Kubernetes $CE_APP_NAME: log"
    echo "************************************"

    FIND=$CE_APP_NAME
    APP_POD=$(kubectl get pod -n $CE_PROJECT_NAMESPACE | grep $FIND | awk '{print $1}')
    echo "************************************"
    echo "Show log for the pod: $APP_POD"
    echo "************************************"
    kubectl logs -f $APP_POD
}

#**********************************************************************************
# Execution
# *********************************************************************************

set_target
setup_ce_project
kube_information
kube_pod_log