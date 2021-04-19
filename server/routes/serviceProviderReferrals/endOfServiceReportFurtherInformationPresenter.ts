import { EndOfServiceReport } from '../../services/interventionsService'
import PresenterUtils from '../../utils/presenterUtils'

export default class EndOfServiceReportFurtherInformationPresenter {
  constructor(
    private readonly endOfServiceReport: EndOfServiceReport,
    private readonly userInputData: Record<string, unknown> | null = null
  ) {}

  readonly text = {
    title: 'Would you like to give any additional information about this intervention (optional)?',
  }

  private readonly utils = new PresenterUtils(this.userInputData)

  readonly fields = {
    furtherInformation: {
      value: this.utils.stringValue(this.endOfServiceReport.furtherInformation, 'further-information'),
    },
  }
}
