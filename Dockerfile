FROM alpine
RUN apk update && apk add npm mysql-client
COPY ./app /opt/Linux-Rocks
COPY ./html /srv/opt/Linux-Rocks
COPY ./LICENSE /srv/opt/Linux-Rocks
WORKDIR /opt/Linux-Rocks
RUN npm install
CMD ["npm", "start"]
