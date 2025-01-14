import { TagArgs, TableArgs } from '../../utils/govukFrontendTypes'

import InterventionProgressPresenter from './interventionProgressPresenter'

export default class InterventionProgressView {
  constructor(private readonly presenter: InterventionProgressPresenter) {}

  private sessionTableArgs(tagMacro: (args: TagArgs) => string): TableArgs {
    return {
      head: this.presenter.sessionTableHeaders.map((header: string) => {
        return { text: header }
      }),
      rows: this.presenter.sessionTableRows.map(row => {
        return [
          { text: `Session ${row.sessionNumber}` },
          { text: `${row.appointmentTime}` },
          { text: tagMacro(row.tagArgs as TagArgs) },
          { html: `${row.linkHtml}` },
        ]
      }),
    }
  }

  private readonly backLinkArgs = {
    text: 'Back',
    href: '/probation-practitioner/dashboard',
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'probationPractitionerReferrals/interventionProgress',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs,
        subNavArgs: this.presenter.referralOverviewPagePresenter.subNavArgs,
        serviceUserBannerArgs: this.presenter.referralOverviewPagePresenter.serviceUserBannerArgs,
        sessionTableArgs: this.sessionTableArgs.bind(this),
      },
    ]
  }
}
