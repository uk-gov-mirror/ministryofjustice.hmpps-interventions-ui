import { Request, Response } from 'express'
import InterventionsService from '../../services/interventionsService'
import InterventionDetailsPresenter from './interventionDetailsPresenter'
import InterventionDetailsView from './interventionDetailsView'
import InterventionsFilter from './interventionsFilter'
import SearchResultsPresenter from './searchResultsPresenter'
import SearchResultsView from './searchResultsView'

export default class FindInterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  async search(req: Request, res: Response): Promise<void> {
    const filter = InterventionsFilter.fromRequest(req)

    const [interventions, pccRegions] = await Promise.all([
      this.interventionsService.getInterventions(res.locals.user.token.accessToken, filter.params),
      this.interventionsService.getPccRegions(res.locals.user.token.accessToken),
    ])

    const presenter = new SearchResultsPresenter(interventions, filter, pccRegions)
    const view = new SearchResultsView(presenter)

    res.render(...view.renderArgs)
  }

  async viewInterventionDetails(req: Request, res: Response): Promise<void> {
    const intervention = await this.interventionsService.getIntervention(
      res.locals.user.token.accessToken,
      req.params.id
    )

    const presenter = new InterventionDetailsPresenter(intervention)
    const view = new InterventionDetailsView(presenter)

    res.render(...view.renderArgs)
  }
}
