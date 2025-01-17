import { Request } from 'express'
import { UpdateDraftActionPlanParams } from '../../services/interventionsService'
import errorMessages from '../../utils/errorMessages'
import { FormValidationError } from '../../utils/formValidationError'

export default class AddActionPlanActivitiesForm {
  private constructor(private readonly request: Request) {}

  static async createForm(request: Request): Promise<AddActionPlanActivitiesForm> {
    return new AddActionPlanActivitiesForm(request)
  }

  get activityParamsForUpdate(): Partial<UpdateDraftActionPlanParams> {
    return {
      newActivity: {
        description: this.request.body.description,
        desiredOutcomeId: this.desiredOutcomeId,
      },
    }
  }

  private get desiredOutcomeId(): string {
    return this.request.body['desired-outcome-id']
  }

  get isValid(): boolean {
    return this.request.body.description !== ''
  }

  get errors(): { desiredOutcomeId: string; error: FormValidationError }[] {
    if (this.isValid) {
      return []
    }

    return [
      {
        desiredOutcomeId: this.desiredOutcomeId,
        error: {
          errors: [
            {
              errorSummaryLinkedField: 'description',
              formFields: ['description'],
              message: errorMessages.actionPlanActivity.empty,
            },
          ],
        },
      },
    ]
  }
}
