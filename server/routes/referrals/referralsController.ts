import InterventionsService from '../../services/interventionsService'

export default class ReferralsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  async startReferral(req, res): Promise<void> {
    res.render('referrals/start')
  }
}
