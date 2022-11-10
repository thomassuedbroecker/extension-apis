# Application development

The application is implemented in the `code/node-js-extension/server.js` file.
Please verify the bash automation scripts to configure to your needs when needed.

* [`code/node-js-extension/build-and-verify-container.sh`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/build-and-verify-container.sh)
* [`code/node-js-extension/build-and-push-container.sh`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/build-and-push-container.sh)

### 1. Run Node.js application locally

#### Step 1: Execute following commands:

```sh
cd code/node-js-extension
cp .env_template .env
npm install
node server.js
```

#### Step 2: Verify the output

You should get this output:

```sh
extension backend is running
```

#### Step 3: Insert following URL in your browser `http://localhost:3000/v1/getmessage`

#### Step 4: Insert into the requested login in your browser the values for user and password as `admin`.

#### Step 5: Verify the output

You should get this output `"{"message":"Example usage"}"`

### 2. Run the container locally

#### Step 1: Execute following commands:

```sh
cd code/node-js-extension
sh build-and-verify-container.sh
```
#### Step 2: Verify the output

You should get this output:

```sh
extension backend is running
```

#### Step 3: Insert following URL in your browser `http://localhost:3000/v1/getmessage`

#### Step 4: Insert into the requested login in your browser the values for user and password as `admin`.

#### Step 5: Verify the output

You should get this output `"{"message":"Example usage"}"`

### 3. Push container to container registry 

Here you need to configure your container engine and your container registry in the related bash automation * [`build-and-push-container.sh`](https://github.com/thomassuedbroecker/extension-apis/blob/main/code/node-js-extension/build-and-push-container.sh).

```sh
export IMAGE_NAME=nodejs-assistant-extension:v0.0.3
export URL=quay.io
export REPOSITORY=tsuedbroecker
export CONTAINER_RUNTIME=podman
```

#### Step 1: Execute following commands:

```sh
cd code/node-js-extension
sh build-and-push-container.sh
```

#### Step 2: Verify the output

```sh
Successfully tagged quay.io/tsuedbroecker/nodejs-assistant-extension:v0.0.3
```