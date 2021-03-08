import { Request } from 'express'
import { UpdateDraftActionPlanParams } from '../../services/interventionsService'
import errorMessages from '../../utils/errorMessages'
import { FormValidationError } from '../../utils/formValidationError'

export default class AddActionPlanActivityForm {
  private constructor(private readonly request: Request) {}

  static async createForm(request: Request): Promise<AddActionPlanActivityForm> {
    return new AddActionPlanActivityForm(request)
  }

  get activityParamsForUpdate(): Partial<UpdateDraftActionPlanParams> {
    return {
      newActivity: {
        description: this.request.body['add-activity'],
        desiredOutcomeId: this.request.body['desired-outcome-id'],
      },
    }
  }

  get isValid(): boolean {
    return this.request.body['add-activity'] !== ''
  }

  get error(): FormValidationError | null {
    if (this.isValid) {
      return null
    }

    return {
      errors: [
        {
          errorSummaryLinkedField: 'add-activity',
          formFields: ['add-activity'],
          message: errorMessages.actionPlanActivity.empty,
        },
      ],
    }
  }
}
