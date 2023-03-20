##############################
#           BUILD
##############################
FROM node:19-alpine as BUILD

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY server.js ./
# COPY .env ./

##############################
#           PRODUCTION
##############################
FROM node:19-alpine


RUN apk --no-cache add curl=7.83.1-r6
RUN apk --no-cache add libcrypto1.1=1.1.1t-r0
RUN apk update

# Set permissions
WORKDIR /usr/src/app
COPY --from=BUILD /usr/src/app .
RUN chmod -R 777 /usr/src/app && \
    addgroup extension_group && \
    adduser -D extension_user -G extension_group

# Configure setup of the container
COPY ./docker_entrypoint.sh .
COPY ./generate_env-config.sh .

EXPOSE 3000
CMD ["/bin/sh","docker_entrypoint.sh"]