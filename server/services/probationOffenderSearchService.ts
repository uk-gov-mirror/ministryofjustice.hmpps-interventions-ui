import type HmppsAuthClient from '../data/hmppsAuthClient'
import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../log'

export interface DeliusUser {
  userId: string
  username: string
  firstName: string
  surname: string
  email: string
  enabled: boolean
  roles: Array<DeliusRole>
}

interface DeliusRole {
  name: string
}

export default class ProbationOffenderSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private restClient(token: string): RestClient {
    return new RestClient('Probation Offender Search', config.apis.probationOffenderSearch, token)
  }

  async getUserByCrn(crn: string): Promise<DeliusUser> {
    const token = await this.hmppsAuthClient.getApiClientToken()

    logger.info(`getting user details for CRN ${crn}`)
    return (await this.restClient(token).post({
      path: '/phrase',
      data: {
        matchAllTerms: true,
        phrase: 'john smith 19/07/1965',
        probationAreasFilter: ['N01', 'N02'],
      },
    })) as DeliusUser
  }
}
