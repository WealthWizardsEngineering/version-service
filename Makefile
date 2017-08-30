#This file defines the common targets across our Node.js services
#note MAKEFILE_SUDO_COMMAND will be sudo -n when run from jenkinsfile
#you shouldnt need to set it on a mac for example

NODE_ENV ?= development
DOCKER_COMPOSE ?= docker-compose
DOCKER_RUN ?= ${DOCKER_COMPOSE} run --rm
DOCKER_BASE_IMAGE = node
NPM ?= ${DOCKER_RUN} -e NODE_ENV=${NODE_ENV} ${DOCKER_BASE_IMAGE} npm

all: clean-up install lint unit-test component-test

install:
	${MAKEFILE_SUDO_COMMAND} ${NPM} install tap-xunit
	${MAKEFILE_SUDO_COMMAND} ${NPM} install
.PHONY: install

lint:
	${MAKEFILE_SUDO_COMMAND} ${NPM} run lint
.PHONY: lint

unit-test:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_RUN} unit-test
.PHONY: unit-test

component-test:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_RUN} component-test
.PHONY: component-test

release:
	@npm version patch
.PHONY: release

dependency-check:
	./node_modules/.bin/nsp check
.PHONY: dependency-check

publish:
	npm version `./node_modules/.bin/conventional-recommended-bump -p angular`
	${MAKEFILE_SUDO_COMMAND} ${NPM} publish
.PHONY: publish

clean-up:
	${MAKEFILE_SUDO_COMMAND} ${NPM} prune
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_RUN} ${DOCKER_BASE_IMAGE} rm -rf .nyc_output node_modules coverage component-test-report.xml unit-test-report.xml
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} stop
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} rm -fv
.PHONY: clean-up

dev:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} up dev
.PHONY: dev
