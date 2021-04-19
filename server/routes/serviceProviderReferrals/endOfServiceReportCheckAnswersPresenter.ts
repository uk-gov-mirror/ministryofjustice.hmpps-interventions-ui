import {
  EndOfServiceReport,
  EndOfServiceReportOutcome,
  SentReferral,
  ServiceCategory,
} from '../../services/interventionsService'
import { SummaryListItem } from '../../utils/summaryList'

export type EndOfServiceReportAchievementLevelStyle = 'ACHIEVED' | 'PARTIALLY_ACHIEVED' | 'NOT_ACHIEVED'

interface OutcomePresenter {
  title: string
  subtitle: string
  description: string
  changeHref: string
  achievementLevelText: string
  achievementLevelStyle: EndOfServiceReportAchievementLevelStyle
}

export default class EndOfServiceReportCheckAnswersPresenter {
  constructor(
    private readonly referral: SentReferral,
    private readonly endOfServiceReport: EndOfServiceReport,
    private readonly serviceCategory: ServiceCategory
  ) {}

  readonly formAction = `/service-provider/end-of-service-report/${this.endOfServiceReport.id}/submit`

  readonly text = {
    title: `${this.serviceCategory.name}: End of service report`,
    subtitle: 'Review the end of service report',
  }

  readonly interventionSummary: SummaryListItem[] = [
    // TODO
    { key: 'Service user’s name', lines: ['TODO'], isList: false },
  ]

  readonly outcomes: OutcomePresenter[] = this.referral.referral.desiredOutcomesIds.map((desiredOutcomeId, index) => {
    const number = index + 1
    const outcome = this.endOfServiceReport.outcomes.find(anOutcome => anOutcome.desiredOutcome.id === desiredOutcomeId)

    if (!outcome) {
      throw new Error(`Outcome not found for desired outcome ${desiredOutcomeId}`)
    }

    const desiredOutcome = this.serviceCategory.desiredOutcomes.find(
      aDesiredOutcome => aDesiredOutcome.id === desiredOutcomeId
    )

    if (!desiredOutcome) {
      throw new Error(`Desired outcome ${desiredOutcomeId} not found`)
    }

    return {
      title: `Outcome ${number}`,
      subtitle: desiredOutcome.description,
      // TODO additionalTaskComments?
      description: outcome.progressionComments,
      changeHref: `/service-provider/end-of-service-report/${this.endOfServiceReport.id}/outcomes/${number}`,
      achievementLevelText: this.achievementLevelText(outcome),
      achievementLevelStyle: outcome.achievementLevel,
    }
  })

  private achievementLevelText(outcome: EndOfServiceReportOutcome): string {
    switch (outcome.achievementLevel) {
      case 'ACHIEVED':
        return 'Achieved'
      case 'NOT_ACHIEVED':
        return 'Not achieved'
      case 'PARTIALLY_ACHIEVED':
        return 'Partially achieved'
      default:
        return ''
    }
  }

  readonly furtherInformation = {
    text: this.endOfServiceReport.furtherInformation ?? '',
    changeHref: `/service-provider/end-of-service-report/${this.endOfServiceReport.id}/further-information`,
  }
}
