import { Request } from 'express'
import AddActionPlanActivityForm from './addActionPlanActivityForm'

describe(AddActionPlanActivityForm, () => {
  describe('activityParamsForUpdate', () => {
    it('returns the params to be sent to the backend, when the data in the body is valid', async () => {
      const form = await AddActionPlanActivityForm.createForm({
        body: {
          'add-activity': 'Attend a training course',
          'desired-outcome-id': '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
        },
      } as Request)

      expect(form.activityParamsForUpdate).toEqual({
        newActivity: {
          description: 'Attend a training course',
          desiredOutcomeId: '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
        },
      })
    })
  })

  describe('isValid', () => {
    describe('when there is a non-empty text string for "add-activity"', () => {
      it('returns true', async () => {
        const form = await AddActionPlanActivityForm.createForm({
          body: {
            'add-activity': 'Attend a training course',
            'desired-outcome-id': '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
          },
        } as Request)

        expect(form.isValid).toEqual(true)
      })
    })

    describe('when there is an empty string for "add-activity"', () => {
      it('returns false', async () => {
        const form = await AddActionPlanActivityForm.createForm({
          body: {
            'add-activity': '',
            'desired-outcome-id': '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
          },
        } as Request)

        expect(form.isValid).toEqual(false)
      })
    })
  })

  describe('error', () => {
    describe('when there is a non-empty text string for "add-activity"', () => {
      it('returns null', async () => {
        const form = await AddActionPlanActivityForm.createForm({
          body: {
            'add-activity': 'Attend a training course',
            'desired-outcome-id': '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
          },
        } as Request)

        expect(form.error).toEqual(null)
      })
    })

    describe('when there is an empty string for "add-activity"', () => {
      it('returns false', async () => {
        const form = await AddActionPlanActivityForm.createForm({
          body: {
            'add-activity': '',
            'desired-outcome-id': '29843fdf-8b88-4b08-a0f9-dfbd3208fd2e',
          },
        } as Request)

        expect(form.error).toEqual({
          errors: [
            {
              errorSummaryLinkedField: 'add-activity',
              formFields: ['add-activity'],
              message: 'Enter an activity',
            },
          ],
        })
      })
    })
  })
})
