import { Factory } from 'fishery'
import { DeliusOffender } from '../../server/services/communityApiService'

export default Factory.define<DeliusOffender>(({ sequence }) => ({
  offenderId: String(sequence),
  firstName: 'Alex',
  surname: 'River',
  dateOfBirth: '1982-10-24',
}))
