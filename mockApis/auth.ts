import jwt from 'jsonwebtoken'
import Wiremock from './wiremock'
import TokenVerifiationMocks from './tokenVerification'

export default class AuthServiceMocks {
  constructor(private readonly wiremock: Wiremock) {}

  private readonly tokenVerification = new TokenVerifiationMocks(this.wiremock)

  private createToken = (authSource: string): string => {
    const payload = {
      user_name: 'USER1',
      scope: ['read'],
      auth_source: authSource,
      authorities: [],
      jti: '83b50a10-cca6-41db-985f-e87efb303ddb',
      client_id: 'interventions',
    }

    return jwt.sign(payload, 'secret', { expiresIn: '1h' })
  }

  getLoginUrl = async (): Promise<string> => {
    return this.wiremock.getRequests().then(data => {
      const { requests } = data.body
      const stateParam = requests[0].request.queryParams.state
      const stateValue = stateParam ? stateParam.values[0] : requests[1].request.queryParams.state.values[0]
      return `/login/callback?code=codexxxx&state=${stateValue}`
    })
  }

  private favicon = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/favicon.ico',
      },
      response: {
        status: 200,
      },
    })
  }

  private ping = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/health/ping',
      },
      response: {
        status: 200,
      },
    })
  }

  private redirect = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=interventions',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: 'http://localhost:3007/login/callback?code=codexxxx&state=stateyyyy',
        },
        body: '<html><body>Login page<h1>Sign in</h1></body></html>',
      },
    })
  }

  private logout = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/logout.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: '<html><body>Login page<h1>Sign in</h1></body></html>',
      },
    })
  }

  private token = async (authSource: string): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'POST',
        urlPattern: '/auth/oauth/token',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Location: 'http://localhost:3007/login/callback?code=codexxxx&state=stateyyyy',
        },
        jsonBody: {
          access_token: this.createToken(authSource),
          user_name: 'USER1',
          user_id: '9C2744E3-65CD-4B40-B036-95DBD6F9A871',
          auth_source: authSource,
          token_type: 'bearer',
          expires_in: 599,
          scope: 'read',
        },
      },
    })
  }

  private stubUser = async (authSource: string): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/api/user/me',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          userId: '9C2744E3-65CD-4B40-B036-95DBD6F9A871',
          username: 'USER1',
          active: true,
          name: 'john smith',
          authSource,
        },
      },
    })
  }

  private stubUserRoles = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/api/user/me/roles',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [{ roleId: 'SOME_USER_ROLE' }],
      },
    })
  }

  private stubAuthUserGroups = async (): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/auth/api/authuser/\\w+/groups',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: [{ groupCode: 'INT_SP_EXAMPLE_1', groupName: 'Example Service Provider' }],
      },
    })
  }

  stubGetSPUserByEmailAddress = async (responseJson: Record<string, unknown>): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        // We don’t care about the query (email address)
        urlPath: '/auth/api/authuser',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: responseJson,
      },
    })
  }

  stubGetSPUserByUsername = async (username: string, responseJson: Record<string, unknown>): Promise<unknown> => {
    return this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: `/auth/api/authuser/${username}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: responseJson,
      },
    })
  }

  private stubToken = async (authSource: string): Promise<unknown> => {
    return Promise.all([this.token(authSource), this.tokenVerification.stubVerifyToken()])
  }

  private stubUserAndRoles = async (authSource: string): Promise<unknown> => {
    return Promise.all([this.stubUser(authSource), this.stubUserRoles()])
  }

  stubPing = async (): Promise<unknown> => {
    return Promise.all([this.ping(), this.tokenVerification.stubPing()])
  }

  stubLogin = async (): Promise<unknown> => {
    return Promise.all([this.favicon(), this.redirect(), this.logout()])
  }

  stubServiceProviderToken = async (): Promise<unknown> => {
    return this.stubToken('auth')
  }

  stubProbationPractitionerToken = async (): Promise<unknown> => {
    return this.stubToken('delius')
  }

  stubServiceProviderUser = async (): Promise<unknown> => {
    return Promise.all([this.stubUserAndRoles('auth'), this.stubAuthUserGroups()])
  }

  stubProbationPractitionerUser = async (): Promise<unknown> => {
    return this.stubUserAndRoles('delius')
  }
}
