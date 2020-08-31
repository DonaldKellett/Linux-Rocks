#!/bin/sh

(sudo docker container stop linux-rocks-webserver || true) 2> /dev/null
(sudo docker container stop linux-rocks-database || true) 2> /dev/null
(sudo docker container rm linux-rocks-webserver || true) 2> /dev/null
(sudo docker container rm linux-rocks-database || true) 2> /dev/null
(sudo docker image rm linux-rocks || true) 2> /dev/null
