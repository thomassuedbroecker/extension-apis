# Deploy to `Code Engine`

### 1. Resources we are going to create

We will create following in `Code Engine` resources.

  * [One project](https://cloud.ibm.com/docs/codeengine?topic=codeengine-manage-project)
  * [One application](https://cloud.ibm.com/docs/codeengine?topic=codeengine-application-workloads)
  * [Two secrets](https://cloud.ibm.com/docs/codeengine?topic=codeengine-configmap-secret)

Locally we will create the Open API `JSON` and `YAML` with the correct application URL:

  * [`assistant-extension.json`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/assistant-extension.json-template)
  * [`assistant-extension.yaml`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/assistant-extension.yaml-template)

### Deploy the application

#### Step 1: Verify the automation [`deploy-application.sh`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/deploy-application.sh) for the registry and repository and the image tag.

```sh
export REGISTRY="quay.io"
export REPOSITORY=tsuedbroecker
...
export COMMONTAG="v0.0.3"
export EXTENSION_IMAGE="$REGISTRY/$REPOSITORY/nodejs-assistant-extension:$COMMONTAG"
```

#### Step 2: Execute following commands

```sh
cd code/node-js-extension
export ROOTFOLDER=$(pwd)
export MYPROJECT=ce-assistant-extension
export RESOURCE_GROUP=default
export REGION=eu-de

ibmcloud login (-sso)
ibmcloud target -r $REGION -g $RESOURCE_GROUP

sh ./deploy-application.sh
```

#### Step 3: Verify the output

The output shows the URL of the `Code Engine` application.

```sh
************************************
 URLs
************************************
 - Extension  : https://assistant-extension.v1j51p93c1o.eu-de.codeengine.appdomain.cloud
```

#### Step 4: Insert following URL in your browser `http://[APPLICATION_URL]/v1/getmessage`

#### Step 5: Insert into the requested login in your browser the values for user and password as `admin`.

#### Step 6: Verify the output

You should get this output `"{"message":"Code Engine usage"}"`scaled
