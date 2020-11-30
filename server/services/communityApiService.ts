import type HmppsAuthClient from '../data/hmppsAuthClient'
import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../log'

interface DeliusUser {
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

export default class CommunityApiService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private restClient(token: string): RestClient {
    return new RestClient('Community API Client', config.apis.communityApi, token)
  }

  async getUserByUsername(username: string): Promise<DeliusUser> {
    const token = await this.hmppsAuthClient.getApiClientToken()

    logger.info(`getting user details for username ${username}`)
    return (await this.restClient(token).get({ path: `/secure/users/${username}/details` })) as DeliusUser
  }
}