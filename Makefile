dependencies:
	npm i

build:
	docker-compose build

up:
	docker-compose up

local: dependencies build up
