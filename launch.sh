#!/bin/sh

./cleanup.sh
sudo docker container run --rm -d -e MYSQL_ROOT_PASSWORD=root-passwd -e MYSQL_DATABASE=voters -e MYSQL_USER=voters -e MYSQL_PASSWORD=voters-pw --name linux-rocks-database mariadb
echo 'Waiting 10 seconds for database service to stabilize ...'
sleep 10
sudo docker image build -t linux-rocks .
sudo docker container run --rm -d -p 80:80 --name linux-rocks-webserver linux-rocks
DATABASE_IP=$(sudo docker container exec linux-rocks-database hostname -i)
sudo docker container exec linux-rocks-webserver ash -c "echo $DATABASE_IP > database_ip.txt"
sudo docker container exec linux-rocks-webserver ash -c 'mysql -h $(cat database_ip.txt) -u voters -pvoters-pw voters < setup.sql'
