import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../shared/Button'
import DeleteAccountConfirm from './DeleteAccountConfirm'

const DataPrivacySection = () => {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const handleExport = () => {
    // TODO: GET /api/v1/account/export once the endpoint exists.
    console.log('Export My Data not yet implemented')
  }

  if (confirmingDelete) {
    return <DeleteAccountConfirm onBack={() => setConfirmingDelete(false)} />
  }

  return (
    <div className='dashboard__data-privacy'>
      <Button color='cream' className='dashboard__dp-btn' onClick={handleExport}>
        Export My Data
      </Button>

      <Link to='/privacy' className='dashboard__dp-link'>Privacy Policy</Link>

      <Button color='danger' className='dashboard__dp-btn' onClick={() => setConfirmingDelete(true)}>
        Delete My Account
      </Button>
    </div>
  )
}

export default DataPrivacySection
