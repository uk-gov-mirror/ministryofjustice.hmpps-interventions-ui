import ProbationOffenderSearchService, { DeliusUser } from '../../../services/probationOffenderSearchService'
import MockedHmppsAuthClient from '../../../data/testutils/hmppsAuthClientSetup'

export = class MockProbationOffenderSearchService extends ProbationOffenderSearchService {
  constructor() {
    super(new MockedHmppsAuthClient())
  }

  async getUserByCrn(_crn: string): Promise<DeliusUser> {
    return {
      userId: '987123876',
      username: 'maijam',
      firstName: 'Maija',
      surname: 'Meikäläinen',
      email: 'maijamm@justice.gov.uk',
      enabled: true,
      roles: [],
    }
  }
}
