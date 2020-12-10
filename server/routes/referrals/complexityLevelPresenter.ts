import { DraftReferral } from '../../services/interventionsService'

export default class ComplexityLevelPresenter {
  constructor(private readonly referral: DraftReferral, readonly errorMessage: string | null) {}

  readonly complexityDescriptions: { title: string; value: string; hint: string }[] = [
    { title: 'low comp', value: 'low', hint: 'Some text about the complexity' },
    { title: 'medium comp', value: 'medium', hint: 'Some text about the complexity' },
  ]

  readonly title = `What is the complexity level for the ${this.referral.serviceCategory.name} service?`
}
