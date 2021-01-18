import RestClient from '../data/restClient'
import logger from '../../log'
import { ApiConfig } from '../config'
import { SanitisedError } from '../sanitisedError'

export type InterventionsServiceError = SanitisedError & { validationErrors?: InterventionsServiceValidationError[] }

export interface InterventionsServiceValidationError {
  field: string
  error: string
}

type WithNullableValues<T> = { [K in keyof T]: T[K] | null }

export interface ReferralFields {
  completionDeadline: string
  serviceProviderId: string
  serviceCategoryId: string
  complexityLevelId: string
  furtherInformation: string
  desiredOutcomesIds: string[]
  additionalNeedsInformation: string
  accessibilityNeeds: string
  needsInterpreter: boolean
  interpreterLanguage: string | null
  hasAdditionalResponsibilities: boolean
  whenUnavailable: string | null
  additionalRiskInformation: string
  usingRarDays: boolean
  maximumRarDays: number | null
}

export interface DraftReferral extends WithNullableValues<ReferralFields> {
  id: string
  createdAt: string
  serviceUser: ServiceUser
}

export interface SentReferral {
  id: string
  sentAt: string
  referenceNumber: string
  referral: DraftReferral
}

export interface ServiceCategory {
  id: string
  name: string
  complexityLevels: ComplexityLevel[]
  desiredOutcomes: DesiredOutcome[]
}

export interface ComplexityLevel {
  id: string
  title: string
  description: string
}

export interface DesiredOutcome {
  id: string
  description: string
}

export interface ServiceUser {
  crn: string
  firstName: string | null
}

export interface ServiceProvider {
  id: string
  name: string
}

export default class InterventionsService {
  constructor(private readonly config: ApiConfig) {}

  private createRestClient(token: string): RestClient {
    return new RestClient('Interventions Service API Client', this.config, token)
  }

  private createServiceError(error: unknown): InterventionsServiceError {
    // TODO IC-620 validate this data properly
    const sanitisedError = error as SanitisedError

    const bodyObject = sanitisedError.data as Record<string, unknown>
    if ('validationErrors' in bodyObject) {
      return {
        ...sanitisedError,
        validationErrors: bodyObject.validationErrors as InterventionsServiceValidationError[],
      }
    }

    return sanitisedError
  }

  async getDraftReferral(token: string, id: string): Promise<DraftReferral> {
    logger.info(`Getting draft referral with id ${id}`)

    const restClient = this.createRestClient(token)

    try {
      return (await restClient.get({
        path: `/draft-referral/${id}`,
        headers: { Accept: 'application/json' },
      })) as DraftReferral
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async createDraftReferral(token: string, crn: string): Promise<DraftReferral> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.post({
        path: `/draft-referral`,
        headers: { Accept: 'application/json' },
        data: { serviceUserCrn: crn },
      })) as DraftReferral
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async patchDraftReferral(token: string, id: string, patch: Partial<DraftReferral>): Promise<DraftReferral> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.patch({
        path: `/draft-referral/${id}`,
        headers: { Accept: 'application/json' },
        data: patch,
      })) as DraftReferral
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async getServiceCategory(token: string, id: string): Promise<ServiceCategory> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.get({
        path: `/service-category/${id}`,
        headers: { Accept: 'application/json' },
      })) as ServiceCategory
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async getDraftReferralsForUser(token: string, userId: string): Promise<DraftReferral[]> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: '/draft-referrals',
      query: `userID=${userId}`,
      headers: { Accept: 'application/json' },
    })) as DraftReferral[]
  }

  async getServiceProvider(token: string, id: string): Promise<ServiceProvider> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/service-provider/${id}`,
      headers: { Accept: 'application/json' },
    })) as ServiceProvider
  }

  async sendDraftReferral(token: string, id: string): Promise<SentReferral> {
    const restClient = this.createRestClient(token)

    return (await restClient.post({
      path: `/draft-referral/${id}/send`,
      headers: { Accept: 'application/json' },
    })) as SentReferral
  }

  async getSentReferral(token: string, id: string): Promise<SentReferral> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/sent-referral/${id}`,
      headers: { Accept: 'application/json' },
    })) as SentReferral
  }
}
