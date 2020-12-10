import { ComplexityLevel, DraftReferral } from '../../services/interventionsService'

export default class ComplexityLevelPresenter {
  constructor(
    private readonly referral: DraftReferral,
    private readonly complexityLevels: ComplexityLevel[],
    readonly errorMessage: string | null
  ) {}

  readonly complexityDescriptions: {
    title: string
    value: string
    hint: string
  }[] = this.complexityLevels.map(complexityLevel => {
    return { title: complexityLevel.title, value: complexityLevel.id, hint: complexityLevel.description }
  })

  readonly title = `What is the complexity level for the ${this.referral.serviceCategory.name} service?`
}
