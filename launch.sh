#!/bin/sh

./cleanup.sh
sudo docker image build -t linux-rocks .
sudo docker container run --rm -d -p 80:80 --name linux-rocks_webserver linux-rocks
