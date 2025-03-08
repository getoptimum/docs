#!/usr/bin/make -f

NPM := $(shell which npm)

run-dev:
	echo "⚙️  Running development server..."
	@$(NPM) run docs:dev

build:
	echo "🚀  Building static site..."
	@$(NPM) run docs:build

preview:
	echo "🔍  Previewing production build..."
	@$(NPM) run docs:preview

.PHONY: run-dev build preview
