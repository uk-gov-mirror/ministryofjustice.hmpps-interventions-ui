import { Request } from 'express'
import { ActionPlanAppointmentUpdate } from '../../services/interventionsService'
import TwelveHourBritishDateTimeInput from '../../utils/forms/inputs/twelveHourBritishDateTimeInput'
import { FormData } from '../../utils/forms/formData'
import DurationInput from '../../utils/forms/inputs/durationInput'
import errorMessages from '../../utils/errorMessages'

export default class EditSessionForm {
  constructor(private readonly request: Request) {}

  async data(): Promise<FormData<Partial<ActionPlanAppointmentUpdate>>> {
    const [dateResult, durationResult] = await Promise.all([
      new TwelveHourBritishDateTimeInput(this.request, 'date', 'time', errorMessages.editSession.time).validate(),
      new DurationInput(this.request, 'duration', errorMessages.editSession.duration).validate(),
    ])

    if (dateResult.error || durationResult.error) {
      return {
        paramsForUpdate: null,
        error: { errors: [...(dateResult.error?.errors ?? []), ...(durationResult.error?.errors ?? [])] },
      }
    }

    return {
      error: null,
      paramsForUpdate: {
        appointmentTime: dateResult.value.toISOString() ?? null,
        durationInMinutes: durationResult.value.minutes ?? null,
      },
    }
  }
}
