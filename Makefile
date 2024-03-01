# Makefile for React app

# Variables
NPM = npm
APP_NAME = my-app

# Commands
.PHONY: install start build test clean

install:
	@echo "Installing dependencies..."
	$(NPM) install

start:
	@echo "Starting development server..."
	$(NPM) start

build:
	@echo "Building production bundle..."
	$(NPM) run build

test:
	@echo "Running tests..."
	$(NPM) test

clean:
	@echo "Cleaning build artifacts..."
	rm -rf build

commit:
	@chmod +x .github/hooks/pre-commit
