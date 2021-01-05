import { DraftReferral } from '../../services/interventionsService'
import ReferralDataPresenterUtils from './referralDataPresenterUtils'

export default class RiskInformationPresenter {
  constructor(
    private readonly referral: DraftReferral,
    private readonly errors: { field: string; message: string }[] | null = null,
    private readonly userInputData: Record<string, unknown> | null = null
  ) {}

  readonly summary = [
    { key: 'OGRS score', text: '50' },
    { key: 'ROSHA score', text: 'Medium' },
    { key: 'RM2000 score', text: 'Medium' },
    { key: 'SARA score', text: 'Low' },
    // TODO IC-806 populate with service user data once we have it
  ]

  readonly text = {
    title: `${this.referral.serviceUser?.firstName}’s risk information`,
    additionalRiskInformation: {
      label: `Additional information for the provider about ${this.referral.serviceUser?.firstName}’s risks (optional)`,
      errorMessage: ReferralDataPresenterUtils.errorMessage(this.errors, 'additional-risk-information'),
    },
  }

  readonly errorSummary = this.errors

  private readonly utils = new ReferralDataPresenterUtils(this.referral, this.userInputData)

  readonly fields = {
    additionalRiskInformation: this.utils.stringValue('additionalRiskInformation', 'additional-risk-information'),
  }
}
