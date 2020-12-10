import ComplexityLevelPresenter from './complexityLevelPresenter'

export default class ComplexityLevelView {
  constructor(readonly presenter: ComplexityLevelPresenter) {}

  get radioButtonArgs(): Record<string, unknown> {
    const errorMessage = this.presenter.errorMessage ? { text: this.presenter.errorMessage } : null

    return {
      classes: 'govuk-radios',
      idPrefix: 'complexity-level',
      name: 'complexity-level',
      fieldset: {
        legend: {
          text: this.presenter.title,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--xl',
        },
      },
      errorMessage,
      items: this.presenter.complexityDescriptions.map(complexityDescription => {
        return {
          value: complexityDescription.value,
          text: complexityDescription.title,
          hint: {
            text: complexityDescription.hint,
          },
        }
      }),
    }
  }

  get errorSummaryArgs(): Record<string, unknown> | null {
    if (!this.presenter.errorMessage) {
      return null
    }

    return {
      titleText: 'There is a problem',
      errorList: [
        {
          text: this.presenter.errorMessage,
          href: '#complexity-level',
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referrals/complexityLevel',
      {
        presenter: this.presenter,
        radioButtonArgs: this.radioButtonArgs,
        errorSummaryArgs: this.errorSummaryArgs,
      },
    ]
  }
}
