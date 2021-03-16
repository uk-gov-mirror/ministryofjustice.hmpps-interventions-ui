import ViewUtils from '../../utils/viewUtils'
import ActionPlanConfirmationPresenter from './actionPlanConfirmationPresenter'

export default class ActionPlanConfirmationView {
  constructor(private readonly presenter: ActionPlanConfirmationPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'serviceProviderReferrals/actionPlanConfirmation',
      {
        presenter: this.presenter,
      },
    ]
  }
}
