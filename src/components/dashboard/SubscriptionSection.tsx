// Placeholder subscription data. Billing is handled by the App Store / RevenueCat,
// so this view is read-only. Swap PLACEHOLDER_SUB for a GET /api/v1/subscription
// call once that endpoint exists.
const PLACEHOLDER_SUB = {
  plan: 'Homeschool Master',
  status: 'Active',
  nextBillingDate: '5/15/2026',
}

const SubscriptionSection = () => {
  const { plan, status, nextBillingDate } = PLACEHOLDER_SUB

  return (
    <div className='dashboard__subscription'>
      <div className='dashboard__sub-row'>
        <span className='dashboard__sub-label'>Plan</span>
        <span className='dashboard__sub-field'>{plan}</span>
      </div>

      <div className='dashboard__sub-row'>
        <span className='dashboard__sub-label'>Status</span>
        <span className='dashboard__sub-field'>{status}</span>
      </div>

      <div className='dashboard__sub-row'>
        <span className='dashboard__sub-label'>Next Billing Date</span>
        <span className='dashboard__sub-field'>{nextBillingDate}</span>
      </div>

      <div className='dashboard__sub-manage-wrap'>
        <a className='dashboard__sub-manage' href='https://apps.apple.com/account/subscriptions' target='_blank' rel='noopener noreferrer'>
          Manage Subscription in App Store <span aria-hidden='true'>&rarr;</span>
        </a>
      </div>
    </div>
  )
}

export default SubscriptionSection
