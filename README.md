# sample-api

## 1. Pre-requirements

- Node.js version >= 20.6.0
- yarn version 1.22.21
- `.npmrc` file for private npm packages installation

## 1. Setup for local development

- Setup
  ```bash
  # Copy .env.template to .env
  cp .env.template .env
  # Start development database
  yarn dcc up -d
  # Install dependencies
  yarn install
  # Migrate database and generate prisma client
  yarn prisma:migrate
  ```
- Start
  ```bash
  yarn dev
  ```
- Lint
  ```bash
  yarn lint
  ```

## 2. Testing

- Setup for testing
  ```bash
  yarn pretest
  ```
- Run test with hot reload
  ```bash
  yarn test:run
  ```

## 3. Deployment

- Build
  ```bash
  yarn build
  ```
- Start
  ```bash
  yarn start
  ```
- Deploy to staging environment
  ```bash
  yarn staging:deploy
  ```
