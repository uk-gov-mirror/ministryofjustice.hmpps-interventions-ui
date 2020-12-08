import CalendarDay from './calendarDay'

describe('CalendarDay', () => {
  describe('iso8601', () => {
    it('returns an ISO 8601 formatted date describing the day', () => {
      const calendarDay = new CalendarDay(15, 9, 1992)

      expect(calendarDay.iso8601).toBe('1992-09-15')
    })
  })

  describe('.parseIso8601', () => {
    it('returns a calendar day when given a valid ISO 8601 formatted date', () => {
      expect(CalendarDay.parseIso8601('1992-09-15')).toEqual(new CalendarDay(15, 9, 1992))
    })

    it('returns null when given something other than an ISO 8601 formatted date', () => {
      expect(CalendarDay.parseIso8601('19920915')).toBeNull()
    })
  })
})
