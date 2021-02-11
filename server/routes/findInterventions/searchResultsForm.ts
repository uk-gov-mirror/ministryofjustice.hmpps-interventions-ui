import { Request } from 'express'
import { InterventionsFilterParams } from '../../services/interventionsService'

export default class SearchResultsForm {
  constructor(private readonly request: Request) {}

  //// TODO this form needs to work when there is nothing submitted, too
  // TODO will we need to be able to detect none of the boxes checked? e.g. for gender if we check some by default
  get paramsForFiltering(): InterventionsFilterParams {
    console.log('region ids: ', this.request.query['pcc-region-ids'])
    //// TODO took this from desiredOutcomesForm but how does that work?
    ////if (this.
    const params: InterventionsFilterParams = {}

    // TODO check types?
    if (this.request.query['pcc-region-ids'] !== undefined) {
      params.pccRegionIds = this.request.query['pcc-region-ids'] as string[]
    }

    if (this.request.query['gender'] !== undefined) {
      if ((this.request.query['gender'] as string[]).includes('male')) {
        params.allowsMale = true
      }
      if ((this.request.query['gender'] as string[]).includes('female')) {
        params.allowsFemale = true
      }
    }

    if (this.request.query['age'] !== undefined) {
      if ((this.request.query['age'] as string[]).includes('18-to-25-only')) {
        params.maximumAge = 25
      }
    }

    return params
    //return {
    //// It is indeed an array...?
    ///TODO
    //// oh, but when you have only 1 then you just get a string
    //// I notice that if you pass pcc-region-ids[] then you get an array always
    //pccRegionIds: this.request.query['pcc-region-ids'] as string[],
    //}
  }
}
