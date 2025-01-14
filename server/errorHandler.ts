import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../log'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(
      {
        err: error,
        user: res.locals.user?.username,
        url: req.originalUrl,
      },
      'Error handling request'
    )

    if (res.headersSent) {
      return next(error)
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = error.status
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
