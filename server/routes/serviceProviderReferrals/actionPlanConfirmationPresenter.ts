import {
  Activity,
  DesiredOutcome,
  DraftActionPlan,
  SentReferral,
  ServiceCategory,
} from '../../services/interventionsService'
import { FormValidationError } from '../../utils/formValidationError'
import utils from '../../utils/utils'
import ReferralDataPresenterUtils from '../referrals/referralDataPresenterUtils'

export default class ActionPlanConfirmationPresenter {
  constructor(private readonly sentReferral: SentReferral, private readonly serviceCategory: ServiceCategory) {}

  progressHref = `/service-provider/referrals/${this.sentReferral.id}/progress`
}
