db_up:
	cd docker && docker-compose-db.yml up

db_build:
	cd docker && docker-compose-db.yml up --build

db_down:
	cd docker && docker-compose-db.yml down

run:
	npm run dev

build:
	npm run build