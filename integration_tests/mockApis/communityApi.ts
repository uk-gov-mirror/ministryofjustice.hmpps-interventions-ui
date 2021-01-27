import Wiremock from './wiremock'

export default class CommunityApiMocks {
  constructor(private readonly wiremock: Wiremock) {}

  stubGetServiceUserByCRN = async (crn: string, responseJson: unknown): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: `/community-api/secure/offenders/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: responseJson,
      },
    })
  }
}
