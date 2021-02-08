import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import CommunityApiService from '../services/communityApiService'
import InterventionsService from '../services/interventionsService'
import OffenderAssessmentsApiService from '../services/offenderAssessmentsApiService'
import IntegrationSamplesRoutes from './integrationSamples'
import ServiceProviderReferralsController from './serviceProviderReferrals/serviceProviderReferralsController'
import ReferralsController from './referrals/referralsController'
import StaticContentController from './staticContent/staticContentController'

interface RouteProvider {
  [key: string]: RequestHandler
}

export interface Services {
  communityApiService: CommunityApiService
  offenderAssessmentsApiService: OffenderAssessmentsApiService
  interventionsService: InterventionsService
}

export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const integrationSamples: RouteProvider = IntegrationSamplesRoutes(
    services.communityApiService,
    services.offenderAssessmentsApiService
  )

  const referralsController = new ReferralsController(services.interventionsService, services.communityApiService)
  const staticContentController = new StaticContentController()
  const serviceProviderReferralsController = new ServiceProviderReferralsController(
    services.interventionsService,
    services.communityApiService
  )

  get('/', (req, res, next) => {
    const { authSource } = res.locals.user
    if (authSource === 'delius') {
      res.redirect('/referrals/start')
    } else {
      res.redirect('/service-provider/dashboard')
    }
  })

  get('/service-provider/dashboard', (req, res) => serviceProviderReferralsController.showDashboard(req, res))
  get('/service-provider/referrals/:id', (req, res) => serviceProviderReferralsController.showReferral(req, res))

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    get('/static-pages', (req, res) => {
      staticContentController.index(req, res)
    })

    StaticContentController.allPaths.forEach(path => {
      get(path, (req, res) => {
        staticContentController.renderStaticPage(req, res)
      })
    })
  }

  get('/integrations/delius/user', integrationSamples.viewDeliusUserSample)
  get('/integrations/oasys/assessment', integrationSamples.viewOasysAssessmentSample)

  get('/spike/option-select', (req, res) => res.render('optionSelect/optionSelect'))

  get('/referrals/start', (req, res) => referralsController.startReferral(req, res))
  post('/referrals/start', (req, res) => referralsController.createReferral(req, res))
  get('/referrals/:id/form', (req, res) => referralsController.viewReferralForm(req, res))
  get('/referrals/:id/service-user-details', (req, res) => referralsController.viewServiceUserDetails(req, res))
  post('/referrals/:id/service-user-details', (req, res) => referralsController.confirmServiceUserDetails(req, res))
  get('/referrals/:id/complexity-level', (req, res) => referralsController.viewComplexityLevel(req, res))
  post('/referrals/:id/complexity-level', (req, res) => referralsController.updateComplexityLevel(req, res))
  get('/referrals/:id/completion-deadline', (req, res) => referralsController.viewCompletionDeadline(req, res))
  post('/referrals/:id/completion-deadline', (req, res) => referralsController.updateCompletionDeadline(req, res))
  get('/referrals/:id/further-information', (req, res) => referralsController.viewFurtherInformation(req, res))
  post('/referrals/:id/further-information', (req, res) => referralsController.updateFurtherInformation(req, res))
  get('/referrals/:id/desired-outcomes', (req, res) => referralsController.viewDesiredOutcomes(req, res))
  post('/referrals/:id/desired-outcomes', (req, res) => referralsController.updateDesiredOutcomes(req, res))
  get('/referrals/:id/needs-and-requirements', (req, res) => referralsController.viewNeedsAndRequirements(req, res))
  post('/referrals/:id/needs-and-requirements', (req, res) => referralsController.updateNeedsAndRequirements(req, res))
  get('/referrals/:id/risk-information', (req, res) => referralsController.viewRiskInformation(req, res))
  post('/referrals/:id/risk-information', (req, res) => referralsController.updateRiskInformation(req, res))
  get('/referrals/:id/rar-days', (req, res) => referralsController.viewRarDays(req, res))
  post('/referrals/:id/rar-days', (req, res) => referralsController.updateRarDays(req, res))
  get('/referrals/:id/check-answers', (req, res) => referralsController.checkAnswers(req, res))
  post('/referrals/:id/send', (req, res) => referralsController.sendDraftReferral(req, res))
  get('/referrals/:id/confirmation', (req, res) => referralsController.viewConfirmation(req, res))

  return router
}
