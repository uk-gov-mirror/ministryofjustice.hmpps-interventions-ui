import { Eligibility, Intervention, InterventionsFilterParams, PCCRegion } from '../../services/interventionsService'
import { SummaryListItem } from '../../utils/summaryList'
import utils from '../../utils/utils'

export interface SearchResultPresenter {
  title: string
  href: string
  body: string
  summary: SummaryListItem[]
}

export default class SearchResultsPresenter {
  constructor(
    private readonly interventions: Intervention[],
    // TODO when is there user input data? always I guess
    private readonly userInputData: Record<string, unknown>,
    private readonly pccRegions: PCCRegion[]
  ) {}

  readonly pccRegionFilters: {
    value: string
    text: string
    checked: boolean
  }[] = this.pccRegions.map(region => ({
    value: region.id,
    text: region.name,
    // TODO UGGGGHHHH
    checked: ((this.userInputData['pcc-region-ids'] as string[]) ?? []).includes(region.id),
  }))

  readonly genderFilters: {
    value: string
    text: string
    checked: boolean
  }[] = [
    {
      value: 'male',
      text: 'Male',
      // TODO what to do about this casting?
      checked: ((this.userInputData['gender'] as string[]) ?? []).includes('male'),
    },
    {
      // TODO there's some problem where both are appearing checked
      value: 'female',
      text: 'Female',
      checked: ((this.userInputData['gender'] as string[]) ?? []).includes('female'),
    },
  ]

  readonly ageFilters: {
    value: string
    text: string
    checked: boolean
  }[] = [
    {
      value: '18-to-25-only',
      text: 'Only for ages 18 to 25',
      checked: ((this.userInputData['age'] as string[]) ?? []).includes('18-to-25-only'),
    },
  ]

  readonly results: SearchResultPresenter[] = this.interventions.map(intervention => ({
    title: intervention.title,
    href: '#',
    body: intervention.description,
    summary: [
      {
        key: 'Type',
        lines: ['Dynamic Framework'],
        isList: false,
      },
      {
        key: 'Location',
        lines: [intervention.pccRegions.map(region => region.name).join(', ')],
        isList: false,
      },
      {
        key: 'Criminogenic needs',
        lines: [utils.convertToProperCase(intervention.serviceCategory.name)],
        isList: false,
      },
      {
        key: 'Provider',
        lines: [intervention.serviceProvider.name],
        isList: false,
      },
      {
        key: 'Age group',
        lines: [SearchResultsPresenter.ageGroupDescription(intervention.eligibility)],
        isList: false,
      },
      {
        key: 'Sex',
        lines: [SearchResultsPresenter.sexDescription(intervention.eligibility)],
        isList: false,
      },
    ],
  }))

  private static ageGroupDescription(eligibility: Eligibility): string {
    if (eligibility.maximumAge === null) {
      return `${eligibility.minimumAge}+`
    }
    return `${eligibility.minimumAge}–${eligibility.maximumAge}`
  }

  private static sexDescription(eligibility: Eligibility): string {
    if (eligibility.allowsMale && eligibility.allowsFemale) {
      return 'Male and female'
    }
    if (eligibility.allowsMale) {
      return 'Male'
    }
    if (eligibility.allowsFemale) {
      return 'Female'
    }

    return ''
  }

  readonly text = {
    results: {
      count: this.results.length.toString(),
      countSuffix: `${this.results.length === 1 ? 'result' : 'results'} found.`,
    },
  }
}
