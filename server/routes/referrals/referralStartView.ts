import DraftReferralsListPresenter from './draftReferralsListPresenter'
import { FormValidationError } from '../../utils/formValidationError'
import ReferralDataPresenterUtils from './referralDataPresenterUtils'
import viewUtils from '../../utils/viewUtils'

export default class ReferralStartView {
  constructor(
    private readonly presenter: DraftReferralsListPresenter,
    private readonly error: FormValidationError | null = null
  ) {}

  private get tableArgs(): Record<string, unknown> {
    return {
      firstCellIsHeader: true,
      head: [{ text: 'ID' }, { text: 'Started on' }, { text: 'Link' }],
      rows: this.presenter.orderedReferrals.map(referral => {
        return [{ text: referral.id }, { text: referral.createdAt }, { html: `<a href="${referral.url}">Continue</a>` }]
      }),
    }
  }

  private crnInputArgs(): Record<string, unknown> {
    return {
      id: 'service-user-crn',
      name: 'service-user-crn',
      label: {
        text: 'Service User CRN',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      autocomplete: 'off',
      errorMessage: viewUtils.govukErrorMessage(
        ReferralDataPresenterUtils.errorMessage(this.error, 'service-user-crn')
      ),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referrals/start',
      {
        presenter: this.presenter,
        tableArgs: this.tableArgs,
        crnInputArgs: this.crnInputArgs(),
      },
    ]
  }
}
