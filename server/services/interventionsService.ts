import RestClient from '../data/restClient'
import logger from '../../log'
import { ApiConfig } from '../config'
import { SanitisedError } from '../sanitisedError'
import { DeliusServiceUser } from './communityApiService'
import CalendarDay from '../utils/calendarDay'

export type InterventionsServiceError = SanitisedError & { validationErrors?: InterventionsServiceValidationError[] }

export interface InterventionsServiceValidationError {
  field: string
  error: string
}

type WithNullableValues<T> = { [K in keyof T]: T[K] | null }

export interface ReferralFields {
  createdAt: string
  completionDeadline: string
  serviceProvider: ServiceProvider
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
  serviceUser: ServiceUser
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
  referral: ReferralFields
  sentBy: AuthUser
  assignedTo: AuthUser | null
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
  title: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  gender: string | null
  ethnicity: string | null
  preferredLanguage: string | null
  religionOrBelief: string | null
  disabilities: string[] | null
}

export interface ServiceProvider {
  name: string
}

export interface AuthUser {
  username: string
  userId: string
  authSource: string
}

export interface Intervention {
  id: string
  title: string
  description: string
  npsRegion: NPSRegion | null
  pccRegions: PCCRegion[]
  serviceCategory: ServiceCategory
  serviceProvider: ServiceProvider
  eligibility: Eligibility
}

export interface PCCRegion {
  id: string
  name: string
}

export interface NPSRegion {
  id: string
  name: string
}

export interface Eligibility {
  minimumAge: number
  maximumAge: number | null
  allowsFemale: boolean
  allowsMale: boolean
}

export interface InterventionsFilterParams {
  allowsMale?: boolean
  allowsFemale?: boolean
  pccRegionIds?: string[]
  maximumAge?: number
}

export interface DraftActionPlan extends ActionPlanFields {
  id: string
}

interface ActionPlanFields {
  referralId: string
  activities: Activity[]
  numberOfSessions: number | null
}

interface Activity {
  id: string
  desiredOutcome: DesiredOutcome
  description: string
  createdAt: string
}

interface UpdateActivityParams {
  description: string
  desiredOutcomeId: string
}

interface UpdateDraftActionPlanParams {
  newActivity?: UpdateActivityParams
  numberOfSessions?: number
}

export interface SubmittedActionPlan {
  id: string
  submittedBy: AuthUser
  submittedAt: string
  actionPlanFields: ActionPlanFields
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

  serializeDeliusServiceUser(deliusServiceUser: DeliusServiceUser | null): ServiceUser {
    if (!deliusServiceUser) {
      return {} as ServiceUser
    }

    const currentDisabilities = deliusServiceUser.offenderProfile?.disabilities
      ? deliusServiceUser.offenderProfile.disabilities
          .filter(disability => {
            const today = new Date().toString()
            return disability.endDate === '' || Date.parse(disability.endDate) >= Date.parse(today)
          })
          .map(disability => disability.disabilityType.description)
      : null

    const iso8601DateOfBirth = deliusServiceUser.dateOfBirth
      ? CalendarDay.parseIso8601(deliusServiceUser.dateOfBirth)?.iso8601 || null
      : null

    return {
      crn: deliusServiceUser.otherIds.crn,
      title: deliusServiceUser.title || null,
      firstName: deliusServiceUser.firstName || null,
      lastName: deliusServiceUser.surname || null,
      dateOfBirth: iso8601DateOfBirth || null,
      gender: deliusServiceUser.gender || null,
      ethnicity: deliusServiceUser.offenderProfile?.ethnicity || null,
      preferredLanguage: deliusServiceUser.offenderProfile?.offenderLanguages?.primaryLanguage || null,
      religionOrBelief: deliusServiceUser.offenderProfile?.religion || null,
      disabilities: currentDisabilities,
    }
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

  async createDraftReferral(token: string, crn: string, interventionId: string): Promise<DraftReferral> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.post({
        path: `/draft-referral`,
        headers: { Accept: 'application/json' },
        data: { serviceUserCrn: crn, interventionId },
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

  async getSentReferrals(token: string): Promise<SentReferral[]> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/sent-referrals`,
      headers: { Accept: 'application/json' },
    })) as SentReferral[]
  }

  async assignSentReferral(token: string, id: string, assignee: AuthUser): Promise<SentReferral> {
    const restClient = this.createRestClient(token)

    return (await restClient.post({
      path: `/sent-referral/${id}/assign`,
      data: { assignedTo: assignee },
      headers: { Accept: 'application/json' },
    })) as SentReferral
  }

  async getInterventions(token: string, filter: InterventionsFilterParams): Promise<Intervention[]> {
    const restClient = this.createRestClient(token)

    const filterQuery: Record<string, unknown> = { ...filter }

    if (filter.pccRegionIds !== undefined) {
      filterQuery.pccRegionIds = filter.pccRegionIds.join(',')
    }

    return (await restClient.get({
      path: '/interventions',
      headers: { Accept: 'application/json' },
      query: filterQuery,
    })) as Intervention[]
  }

  async getIntervention(token: string, id: string): Promise<Intervention> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/intervention/${id}`,
      headers: { Accept: 'application/json' },
    })) as Intervention
  }

  async getPccRegions(token: string): Promise<PCCRegion[]> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/pcc-regions`,
      headers: { Accept: 'application/json' },
    })) as PCCRegion[]
  }

  async createDraftActionPlan(token: string, referralId: string): Promise<DraftActionPlan> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.post({
        path: '/draft-action-plan',
        headers: { Accept: 'application/json' },
        data: { referralId },
      })) as DraftActionPlan
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async getDraftActionPlan(token: string, actionPlanId: string): Promise<DraftActionPlan> {
    const restClient = this.createRestClient(token)

    return (await restClient.get({
      path: `/draft-action-plan/${actionPlanId}`,
      headers: { Accept: 'application/json' },
    })) as DraftActionPlan
  }

  async updateDraftActionPlan(
    token: string,
    id: string,
    patch: Partial<UpdateDraftActionPlanParams>
  ): Promise<DraftActionPlan> {
    const restClient = this.createRestClient(token)

    try {
      return (await restClient.patch({
        path: `/draft-action-plan/${id}`,
        headers: { Accept: 'application/json' },
        data: patch,
      })) as DraftActionPlan
    } catch (e) {
      throw this.createServiceError(e)
    }
  }

  async submitActionPlan(token: string, id: string): Promise<SubmittedActionPlan> {
    const restClient = this.createRestClient(token)

    return (await restClient.post({
      path: `/draft-action-plan/${id}/submit`,
      headers: { Accept: 'application/json' },
    })) as SubmittedActionPlan
  }
}
