import { Request, Response } from 'express'
import ProbationOffenderSearchService from '../services/probationOffenderSearchService'

// fixme: this is just sample code to validate secure API access
export default function IntegrationSamplesRoutes(
  probationOffenderSearchService: ProbationOffenderSearchService
): { viewDeliusUserSample: (req: Request, res: Response) => Promise<void> } {
  return {
    viewDeliusUserSample: async (req: Request, res: Response) => {
      const deliusUser = await probationOffenderSearchService.getUserByCrn(req.query.crn as string)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(deliusUser))
    },
  }
}
