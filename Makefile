#!/usr/bin/make -f

YARN := $(shell which yarn)

run-dev:
	@echo "⚙️  Running development server..."
	@$(YARN) docs:dev

build:
	@echo "🚀  Building static site..."
	@$(YARN) docs:build

preview:
	@echo "🔍  Previewing production build..."
	@$(YARN) docs:preview

lint:
	@echo "🧹  Linting..."
	@$(YARN) lint

lint-markdown:
	@echo "🧹  Linting markdown..."
	@$(YARN) lint:md

lint-spelling:
	@echo "🧹  Checking for British spelling..."
	@$(YARN) lint:spelling

.PHONY: run-dev build preview lint lint-markdown lint-spelling
