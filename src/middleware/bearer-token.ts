const bearerPrefix = 'Bearer '

export default ((req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith(bearerPrefix)) {
    req.token = authorization.slice(bearerPrefix.length)
  }
  next()
}) as Express.RequestHandler
