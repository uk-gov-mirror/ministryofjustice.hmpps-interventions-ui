import CommunityApiService from './communityApiService'
import MockedHmppsAuthClient from '../data/testutils/hmppsAuthClientSetup'
import HmppsAuthClient from '../data/hmppsAuthClient'

describe(CommunityApiService, () => {
  const hmppsAuthClientMock = new MockedHmppsAuthClient() as jest.Mocked<HmppsAuthClient>
  const restClientMock = { get: jest.fn() }

  describe('getUserByUsername', () => {
    it('casts the response as a delius user', async () => {
      const service = new CommunityApiService(hmppsAuthClientMock)

      service.restClient = jest.fn().mockReturnValue(restClientMock)
      restClientMock.get.mockResolvedValue({
        email: 'test@digital.justice.gov.uk',
        enabled: false,
        firstName: 'John',
        roles: [
          {
            name: 'TEST_ROLE',
          },
        ],
        surname: 'Smith',
        userId: 12345,
        username: 'test.user',
      })

      hmppsAuthClientMock.getApiClientToken.mockResolvedValue('token')

      const deliusUser = await service.getUserByUsername('test.user')

      expect(deliusUser.userId).toEqual(12345)
      expect(deliusUser.email).toEqual('test@digital.justice.gov.uk')
      expect(deliusUser.username).toEqual('test.user')
      expect(deliusUser.surname).toEqual('Smith')
      expect(deliusUser.firstName).toEqual('John')
      expect(deliusUser.roles[0]).toEqual({ name: 'TEST_ROLE' })
    })
  })
})
