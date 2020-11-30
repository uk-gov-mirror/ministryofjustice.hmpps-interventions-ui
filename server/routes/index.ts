import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import CommunityApiService from '../services/communityApiService'
import InterventionsService from '../services/interventionsService'
import IntegrationSamplesRoutes from './integrationSamples'
import ReferralsController from './referrals/referralsController'

interface RouteProvider {
  [key: string]: RequestHandler
}

export default function routes(
  router: Router,
  communityApiService: CommunityApiService,
  interventionsService: InterventionsService
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const referralsController = new ReferralsController(interventionsService)

  const integrationSamples: RouteProvider = IntegrationSamplesRoutes(communityApiService)

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/integrations/delius/user', integrationSamples.viewDeliusUserSample)

  get('/referrals/start', referralsController.startReferral)

  return router
}
