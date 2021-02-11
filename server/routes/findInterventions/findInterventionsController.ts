import { Request, Response } from 'express'
import InterventionsService from '../../services/interventionsService'
import SearchResultsForm from './searchResultsForm'
import SearchResultsPresenter from './searchResultsPresenter'
import SearchResultsView from './searchResultsView'

export default class FindInterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  async search(req: Request, res: Response): Promise<void> {
    const [interventions, pccRegions] = await Promise.all([
      this.interventionsService.getInterventions(res.locals.user.token, {}),
      this.interventionsService.getPccRegions(res.locals.user.token),
    ])

    const form = new SearchResultsForm(req)

    const presenter = new SearchResultsPresenter(interventions, req.query, pccRegions)
    const view = new SearchResultsView(presenter)

    res.render(...view.renderArgs)
  }
}
