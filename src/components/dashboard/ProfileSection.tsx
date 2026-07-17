import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import EditableSection from './EditableSection'
import NameForm from './NameForm'
import EmailForm from './EmailForm'
import PasswordForm from './PasswordForm'

const fullName = (first: string, middle: string | null, last: string) =>
  [first, middle, last].filter(Boolean).join(' ')

const ProfileSection = () => {
  const user = useSelector((s: RootState) => s.auth.user)
  if (!user) return null

  return (
    <div className='dashboard__profile'>
      <EditableSection
        title='Name'
        summary={fullName(user.firstName, user.middleName, user.lastName)}
        editLabel='Change name'
      >
        {(close) => <NameForm onDone={close} />}
      </EditableSection>

      <div className='dashboard__divider' />

      <EditableSection title='Email' summary={user.email} editLabel='Change email'>
        {(close) => <EmailForm onDone={close} />}
      </EditableSection>

      <div className='dashboard__divider' />

      <EditableSection title='Password' summary='••••••••' editLabel='Change password'>
        {(close) => <PasswordForm onDone={close} />}
      </EditableSection>
    </div>
  )
}

export default ProfileSection
