import { TextareaArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import FurtherInformationPresenter from './furtherInformationPresenter'

export default class FurtherInformationView {
  constructor(private readonly presenter: FurtherInformationPresenter) {}

  private get textAreaArgs(): TextareaArgs {
    return {
      name: 'further-information',
      id: 'further-information',
      label: {
        text: this.presenter.title,
        classes: 'govuk-label--xl',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessage),
      hint: {
        text: this.presenter.hint,
      },
      value: this.presenter.value,
    }
  }

  private readonly errorSummaryArgs = ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary)

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referrals/furtherInformation',
      {
        presenter: this.presenter,
        textAreaArgs: this.textAreaArgs,
        errorSummaryArgs: this.errorSummaryArgs,
      },
    ]
  }
}
