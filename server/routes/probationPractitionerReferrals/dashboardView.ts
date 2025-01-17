import { TableArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import DashboardPresenter from './dashboardPresenter'

export default class DashboardView {
  constructor(private readonly presenter: DashboardPresenter) {}

  private get tableArgs(): TableArgs {
    return {
      firstCellIsHeader: true,
      head: [{ text: 'Service User' }, { text: 'Started on' }],
      rows: this.presenter.orderedReferrals.map(referral => {
        return [
          { html: `<a href="${ViewUtils.escape(referral.url)}">${ViewUtils.escape(referral.serviceUserFullName)}</a>` },
          { text: referral.createdAt },
        ]
      }),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'probationPractitionerReferrals/dashboard',
      {
        presenter: this.presenter,
        tableArgs: this.tableArgs,
      },
    ]
  }
}
