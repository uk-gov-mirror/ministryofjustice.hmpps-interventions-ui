import { Request } from 'express'
import { DraftReferral } from '../../services/interventionsService'
import { ComplexityLevelError } from './complexityLevelPresenter'

export default class ComplexityLevelForm {
  private constructor(private readonly request: Request) {}

  static async createForm(request: Request): Promise<ComplexityLevelForm> {
    return new ComplexityLevelForm(request)
  }

  get paramsForUpdate(): Partial<DraftReferral> {
    return {
      complexityLevelId: this.request.body['complexity-level'],
    }
  }

  get isValid(): boolean {
    return this.request.body['complexity-level'] != null
  }

  get error(): ComplexityLevelError | null {
    if (this.isValid) {
      return null
    }

    return { message: 'Select a complexity level' }
  }
}