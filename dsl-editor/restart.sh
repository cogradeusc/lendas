#!/bin/bash
docker stop dsl-editor
docker rm dsl-editor
docker build -t dsl-editor .
docker run -d --name dsl-editor -p 9090:9090 --env-file .env --restart=always dsl-editor