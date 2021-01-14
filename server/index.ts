import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import UserService from './services/userService'
import CommunityApiService from './services/communityApiService'
import config from './config'
import InterventionsService from './services/interventionsService'
import ProbationOffenderSearchService from './services/probationOffenderSearchService'

const hmppsAuthClient = new HmppsAuthClient()
const userService = new UserService(hmppsAuthClient)
const communityApiService = new CommunityApiService(hmppsAuthClient)
const probationOffenderSearchService = new ProbationOffenderSearchService(hmppsAuthClient)
const interventionsService = new InterventionsService(config.apis.interventionsService)

const app = createApp(userService, communityApiService, probationOffenderSearchService, interventionsService)

export default app
