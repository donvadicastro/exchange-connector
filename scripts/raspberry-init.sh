#!/usr/bin/env bash

wget https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-armv6l.tar.xz
tar -xvf node-v8.11.3-linux-armv6l.tar.xz
cd node-v8.11.3-linux-armv6l
sudo cp -R * /usr/local/
node -v