import RestClient from '../data/restClient'
import logger from '../../log'
import { ApiConfig } from '../config'
import HmppsAuthClient from '../data/hmppsAuthClient'

export interface DraftReferral {
  id: string
  completionDeadline: string | null
  serviceCategory: ServiceCategory | null
}

export interface ServiceCategory {
  id: string
  name: string
}

export interface ComplexityLevel {
  id: string
  title: string
  description: string
}

export default class InterventionsService {
  constructor(private readonly config: ApiConfig, private readonly hmppsAuthClient: HmppsAuthClient) {}

  private async createRestClient(): Promise<RestClient> {
    const token = await this.hmppsAuthClient.getApiClientToken()

    return new RestClient('Interventions Service API Client', this.config, token)
  }

  async getDraftReferral(id: string): Promise<DraftReferral> {
    logger.info(`Getting draft referral with id ${id}`)

    const restClient = await this.createRestClient()

    return (await restClient.get({
      path: `/draft-referral/${id}`,
      headers: { Accept: 'application/json' },
    })) as DraftReferral
  }

  async createDraftReferral(): Promise<DraftReferral> {
    const restClient = await this.createRestClient()

    return (await restClient.post({
      path: `/draft-referral`,
      headers: { Accept: 'application/json' },
    })) as DraftReferral
  }

  async patchDraftReferral(id: string, patch: Partial<DraftReferral>): Promise<DraftReferral> {
    const restClient = await this.createRestClient()

    return (await restClient.patch({
      path: `/draft-referral/${id}`,
      headers: { Accept: 'application/json' },
      data: patch,
    })) as DraftReferral
  }

  async getComplexityLevels(serviceCategoryId: string): Promise<ComplexityLevel[]> {
    const restClient = await this.createRestClient()

    return (await restClient.get({
      path: `/service-categories/${serviceCategoryId}/complexity-levels`,
      headers: { Accept: 'application/json' },
    })) as ComplexityLevel[]
  }
}
