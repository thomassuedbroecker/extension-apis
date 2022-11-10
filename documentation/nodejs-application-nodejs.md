# Node.js application example

### 1. Functionality

The example application does provide a simple REST API to get a message. This simple message we will later display in an `assistant instance` of the IBM Cloud Watson Assistant service.

![](images/nodejs-extension-11.gif)

### 2. Security

The example application is protected by basic authentication (`base64 encoded`).

### 3. Configuration

* The message which is provided by the REST API is configured by an environment variable.
* The user and password are also configured by an environment variables.

### 4. Containerized

* The application is containerized and the environment variables are externalized.

### 5. Tested runtimes

1. Local as Node.js application
2. Containerized versions

    * Local with Podman
    * IBM Cloud "Code Engine" 