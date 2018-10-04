#!/usr/bin/env bash

docker run -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=192.168.99.100 --env ADVERTISED_PORT=9092 --env TOPICS=topic1 spotify/kafka