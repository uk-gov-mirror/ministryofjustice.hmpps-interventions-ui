import { Factory } from 'fishery'
import { DeliusServiceUser } from '../../server/services/communityApiService'

export default Factory.define<DeliusServiceUser>(() => ({
  otherIds: {
    crn: 'X123456',
  },
  offenderProfile: {
    ethnicity: 'British',
    religion: 'Agnostic',
    disabilities: [
      {
        disabilityType: {
          description: 'Autism',
        },
        endDate: '',
        notes: 'Some notes',
        startDate: '2019-01-22',
      },
    ],
    offenderLanguages: {
      primaryLanguage: 'English',
    },
  },
  title: 'Mr',
  firstName: 'Alex',
  surname: 'River',
  contactDetails: {
    emailAddresses: ['alex.river@example.com'],
    phoneNumbers: [
      {
        number: '07123456789',
        type: 'MOBILE',
      },
    ],
  },
  dateOfBirth: '1980-01-01',
  gender: 'Male',
}))
