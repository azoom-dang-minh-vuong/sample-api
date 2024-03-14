import express from 'express'
// import * as OpenApiValidator from 'express-openapi-validator'
import nnnRouter from '@azoom/nnn-router'
import cors from 'cors'
import statuses from 'statuses'
import { NODE_ENV_LIST } from '~/constants/index'

const __dirname = new URL('.', import.meta.url).pathname

// Customize express response
express.response.sendStatus = function (statusCode) {
  const body = { message: statuses(statusCode) || String(statusCode) }
  this.status(statusCode)
  this.type('json')
  this.send(body)
  return this
}

const app = express()

const appRouter = nnnRouter({
  ext: ['ts', 'js'],
  absolutePath: `${__dirname}/routes`,
  debug: process.env.NODE_ENV === NODE_ENV_LIST.development,
})
await appRouter.promise()

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
  express.urlencoded({ extended: true }),
  express.json({ limit: '50MB' }),
  // ...OpenApiValidator.middleware({
  //   apiSpec: `references/openapi.yml`,
  //   validateRequests: true,
  //   validateResponses: true,
  // }),
  appRouter,
  ((err, _req, res, _next) => {
    console.error(err)
    return res.sendStatus(err.statusCode || err.status || 500)
  }) as Express.ErrorRequestHandler,
)

export default app
