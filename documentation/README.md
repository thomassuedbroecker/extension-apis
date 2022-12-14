# Examples to develop and configure Watson Assistant extensions APIs

The objective of this repository is to provide several simple implementation examples of applications, which will be integrated as an extension to [IBM Cloud Watson Assistant service](https://cloud.ibm.com/catalog/services/watson-assistant#about). 

Each application needs to have an [Open API specification](https://github.com/OAI/OpenAPI-Specification) (3.0 is supported).

This repository contains the source code and the steps how to do the setup and use the extension in the [IBM Cloud Watson Assistant service](https://cloud.ibm.com/catalog/services/watson-assistant#about). You can also visit the [Assistant-Toolkit](https://github.com/watson-developer-cloud/assistant-toolkit/tree/master/integrations/extensions#getting-started) to get started with the development and usage of custom extensions.

Here is a `1-hour` YouTube `live stream` related to this repository.

[![Watson Assistant extension APIs - develop and configure a Node.js container](https://img.youtube.com/vi/hTWgs7lBE_k/0.jpg)](https://www.youtube.com/watch?v=hTWgs7lBE_k "Click play on youtube")

### Used IBM Cloud services

* [IBM Cloud Watson Assistant service](https://cloud.ibm.com/catalog/services/watson-assistant#about) The service will be used with a _"lite plan"_ which creates no costs and limited usage.
* [IBM Cloud Code Engine](https://cloud.ibm.com/codeengine/overview) Serverless platform to run job or containers. Will be used with _"pay as you use"_ , but the service provides a free tier.

The diagram shows the simplified architecture dependencies of the running example on IBM Cloud.

![](images/nodejs-extension-13.png)

### Simplified architecture dependencies 

The following diagram displays the simplified architecture dependencies inside a `Watson Assistant Service`. In the examples we are going to integrate a `custom extension` to an `assistant instance`. 

![](images/nodejs-extension-10.png)

 1. Add a custom extensions

    1. We have an `assistant instance` inside `Watson Assistant service`.
    2. The `assistant instance` simplified contains `environments`, `integrations` and `actions`.
    3. The integrations do contain a catalog of extensions.
    4. The extension catalog contains `Out-Of-The-Box` and maybe `custom` extensions.
    5. A `custom extension` uses an Open API specification of an application to consume the  REST API provided by this application.

2. Make a custom extension available for usage in an action.

    1. Add the custom extension the `environments` of the `assistant instance`.

3. Use the `custom extension` in a `step` of an `action`.

   
### Topics for each example

* Local development and containerization
* Deployment to `Code Engine`
* Creation of an `Open API` documentation
* Set up of the integration between the `custom extension` and an `assistant instance`

### Simple coding examples

  * [Node.js](https://nodejs.org/en/download/) with [`basic authenication`](https://en.wikipedia.org/wiki/Basic_access_authentication)
  * [Quarkus](https://quarkus.io/) (planned) with [OpenID connect](https://openid.net/connect/) 