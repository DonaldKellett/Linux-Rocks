#!/bin/sh

(sudo docker container stop linux-rocks_webserver || true) 2> /dev/null
(sudo docker container rm linux-rocks_webserver || true) 2> /dev/null
(sudo docker image rm linux-rocks || true) 2> /dev/null
