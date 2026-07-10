import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { setUser } from '../../store/authSlice'
import api from '../../services/api'
import OnboardingProgress from '../../components/onboarding/OnboardingProgress'
import OnboardingExitModal from '../../components/onboarding/OnboardingExitModal'
import StudentSummaryList from '../../components/onboarding/StudentSummaryList'
import ProfilePhotoStep from '../../components/onboarding/steps/ProfilePhotoStep'
import StudentCountStep from '../../components/onboarding/steps/StudentCountStep'
import StudentDetailsStep from '../../components/onboarding/steps/StudentDetailsStep'
import StudentPhotoStep from '../../components/onboarding/steps/StudentPhotoStep'

export interface StudentDetailsValues {
  firstName: string
  lastName: string
  gradeLevel: string
  color: string
}

export interface StudentDraft extends StudentDetailsValues {
  id: string | null
  photo: File | null
}

type Phase = 'profile' | 'count' | 'student-details' | 'student-photo'

const emptyStudent = (): StudentDraft => ({
  id: null,
  firstName: '',
  lastName: '',
  gradeLevel: '',
  color: '',
  photo: null,
})

const OnboardingPage = () => {
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('profile')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [students, setStudents] = useState<StudentDraft[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [isHydrating, setIsHydrating] = useState(true)
  const [showExitModal, setShowExitModal] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [finishError, setFinishError] = useState<string | null>(null)

  // When set, the parent jumped into an already saved student to edit them.
  // Completing that student's photo step returns them to this index and step.
  const [returnToIndex, setReturnToIndex] = useState<number | null>(null)
  const [returnToStep, setReturnToStep] = useState<number | null>(null)

  // Set right before setUser on any terminal path, so the "already onboarded"
  // guard below does not hijack our own navigation once the flag flips true.
  const completingRef = useRef(false)

  // Resume: pull any students this teacher already saved in a prior visit and
  // hydrate the drafts so we PATCH them rather than creating duplicates.
  useEffect(() => {
    let cancelled = false
    api
      .get('/api/v1/students')
      .then((res) => {
        if (cancelled) return
        const saved: StudentDraft[] = res.data.data.map((s: any) => ({
          id: s.id,
          firstName: s.firstName,
          lastName: s.lastName,
          gradeLevel: s.gradeLevel ?? '',
          color: s.color ?? '',
          photo: null,
        }))
        if (saved.length) {
          setStudents(saved)
          setPhase('count')
        }
      })
      .catch(() => {
        // A failed fetch just means we start fresh; nothing is lost server side.
      })
      .finally(() => {
        if (!cancelled) setIsHydrating(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!user) return null
  if (user.onboardingCompleted && !completingRef.current) {
    return <Navigate to='/dashboard' replace />
  }
  if (isHydrating) return null

  const studentCount = students.length
  const isJumping = returnToIndex !== null
  const effectiveCount = Math.max(studentCount, 1)
  const totalSteps = 2 + effectiveCount * 2
  const liveStep =
    phase === 'profile' ? 1
      : phase === 'count' ? 2
        : phase === 'student-details' ? 3 + currentIndex * 2
          : 4 + currentIndex * 2
  // While editing a saved student, hold the bar at the step we jumped from:
  // the parent has not lost progress by going back to fix something.
  const stepNumber = returnToStep ?? liveStep

  // Flip the onboarding flag on the teacher, then leave the wizard.
  const completeOnboarding = async (destination: string) => {
    setIsFinishing(true)
    setFinishError(null)
    try {
      completingRef.current = true
      const res = await api.patch('/api/v1/onboarding')
      dispatch(setUser(res.data.data))
      navigate(destination)
    } catch (error: any) {
      completingRef.current = false
      setIsFinishing(false)
      setShowExitModal(false)
      setFinishError(
        error.response?.data?.error?.message ||
        'Something went wrong finishing setup. Please try again.'
      )
    }
  }

  // Profile step (step 1)
  const handleProfileNext = () => setPhase('count')
  const handleProfileSkipPhoto = () => {
    setProfilePhoto(null)
    setPhase('count')
  }

  // Count step (step 2). May reject so the step can surface the error.
  const handleCountBack = () => setPhase('profile')
  const handleCountNext = async (count: number) => {
    // If lowering the count below students already created, soft delete the
    // trimmed ones so we never orphan records the parent no longer wants.
    const trimmed = students.slice(count).filter((s) => s.id)
    if (trimmed.length) {
      await Promise.all(trimmed.map((s) => api.delete(`/api/v1/students/${s.id}`)))
    }
    const next = [...students]
    while (next.length < count) next.push(emptyStudent())
    next.length = count
    setStudents(next)

    // Resume at the first student who has not been saved yet.
    const firstIncomplete = next.findIndex((s) => s.id === null)
    setCurrentIndex(firstIncomplete === -1 ? 0 : firstIncomplete)
    setPhase('student-details')
  }

  // Jump into a student from the summary list. Selecting an already saved
  // student sets up a return to origin; selecting the next unsaved student
  // resumes the linear flow from there.
  const handleSelectStudent = (index: number) => {
    const isUnsaved = students[index]?.id === null
    if (isUnsaved) {
      setReturnToIndex(null)
      setReturnToStep(null)
    } else if (!isJumping) {
      setReturnToIndex(currentIndex)
      setReturnToStep(liveStep)
    }
    setCurrentIndex(index)
    setPhase('student-details')
  }

  // Jump back to the count step from the summary list. Clears any active edit
  // jump so the count step is a clean landing rather than mid jump state.
  const handleChangeCount = () => {
    setReturnToIndex(null)
    setReturnToStep(null)
    setPhase('count')
  }

  const exitJump = () => {
    if (returnToIndex === null) return false
    setCurrentIndex(returnToIndex)
    setReturnToIndex(null)
    setReturnToStep(null)
    setPhase('student-photo')
    return true
  }

  // Student details step. Creates on first completion, patches on a later edit.
  // Rejects on failure so the step surfaces the error and stays put.
  const handleDetailsBack = () => {
    if (exitJump()) return
    if (currentIndex === 0) {
      setPhase('count')
    } else {
      setCurrentIndex((i) => i - 1)
      setPhase('student-photo')
    }
  }
  const handleDetailsNext = async (values: StudentDetailsValues) => {
    const draft = students[currentIndex]
    const res = draft.id
      ? await api.patch(`/api/v1/students/${draft.id}`, values)
      : await api.post('/api/v1/students', values)
    const saved = res.data.data
    setStudents((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, ...values, id: saved.id } : s))
    )
    setPhase('student-photo')
  }

  // Student photo step. Photo is held locally only until storage is chosen.
  const handlePhotoFile = (file: File | null) => {
    setStudents((prev) => prev.map((s, i) => (i === currentIndex ? { ...s, photo: file } : s)))
  }
  const handlePhotoBack = () => setPhase('student-details')
  const advanceFromPhoto = () => {
    if (exitJump()) return
    if (currentIndex < studentCount - 1) {
      setCurrentIndex((i) => i + 1)
      setPhase('student-details')
    } else {
      completeOnboarding('/download')
    }
  }
  const handlePhotoNext = () => advanceFromPhoto()
  const handlePhotoSkipPhoto = () => {
    handlePhotoFile(null)
    advanceFromPhoto()
  }

  // Escape hatch above the progress bar.
  const handleSkipOnboarding = () => completeOnboarding('/dashboard')
  const handleFinishLaterClick = () => setShowExitModal(true)
  const handleExitConfirm = () => completeOnboarding('/dashboard')
  const handleExitCancel = () => setShowExitModal(false)

  const hero = (() => {
    switch (phase) {
      case 'profile':
        return {
          eyebrow: 'Set up your account',
          headline: 'Upload your profile picture',
          subhead: 'This helps personalize your dashboard. You can change it anytime.',
        }
      case 'count':
        return {
          eyebrow: 'Set up your family',
          headline: "Let's set up your students",
          subhead: "Tell us how many students you'll be homeschooling. You can add or remove students later.",
        }
      case 'student-details':
        return {
          eyebrow: `Student ${currentIndex + 1} of ${studentCount}`,
          headline: 'Tell us about your student',
          subhead: 'Just the basics. You can add more details later in the app.',
        }
      case 'student-photo': {
        const name = students[currentIndex]?.firstName?.trim()
        return {
          eyebrow: `Student ${currentIndex + 1} of ${studentCount}`,
          headline: name ? `Upload ${name}'s picture` : "Upload your student's picture",
          subhead: "This shows up in the family selector. You can add it later if you'd rather.",
        }
      }
    }
  })()

  const renderStep = () => {
    switch (phase) {
      case 'profile':
        return (
          <ProfilePhotoStep
            file={profilePhoto}
            onFileChange={setProfilePhoto}
            onNext={handleProfileNext}
            onSkip={handleProfileSkipPhoto}
          />
        )
      case 'count':
        return (
          <StudentCountStep
            defaultCount={studentCount || undefined}
            students={students}
            onBack={handleCountBack}
            onNext={handleCountNext}
          />
        )
      case 'student-details':
        return (
          <StudentDetailsStep
            key={currentIndex}
            student={students[currentIndex]}
            onBack={handleDetailsBack}
            onNext={handleDetailsNext}
          />
        )
      case 'student-photo':
        return (
          <StudentPhotoStep
            key={currentIndex}
            file={students[currentIndex]?.photo ?? null}
            onFileChange={handlePhotoFile}
            onBack={handlePhotoBack}
            onNext={handlePhotoNext}
            onSkip={handlePhotoSkipPhoto}
            isLast={!isJumping && currentIndex === studentCount - 1}
            isSubmitting={isFinishing}
          />
        )
    }
  }

  const showSummary = phase === 'student-details' || phase === 'student-photo'

  return (
    <div className='onboarding'>
      <section className='onboarding__hero'>
        <div className='onboarding__hero-inner'>
          <p className='onboarding__eyebrow'>{hero.eyebrow}</p>
          <h1 className='onboarding__headline'>{hero.headline}</h1>
          <p className='onboarding__subhead'>{hero.subhead}</p>
        </div>
      </section>

      <section className='onboarding__body'>
        <div className='onboarding__body-inner'>
          <div className='onboarding__exit'>
            {phase === 'profile' ? (
              <button
                type='button'
                className='onboarding__exit-btn'
                onClick={handleSkipOnboarding}
                disabled={isFinishing}
              >
                Skip onboarding
              </button>
            ) : (
              <button
                type='button'
                className='onboarding__exit-btn'
                onClick={handleFinishLaterClick}
                disabled={isFinishing}
              >
                Save &amp; finish later
              </button>
            )}
          </div>

          <OnboardingProgress step={stepNumber} totalSteps={totalSteps} />
          {finishError && <p className='onboarding__error'>{finishError}</p>}

          <div className={`onboarding__layout ${showSummary ? 'onboarding__layout--with-summary' : ''}`}>
            <div className='onboarding__layout-main'>{renderStep()}</div>

            {showSummary && (
              <StudentSummaryList
                students={students}
                currentIndex={currentIndex}
                onSelect={handleSelectStudent}
                onChangeCount={handleChangeCount}
                disabled={isFinishing}
              />
            )}
          </div>
        </div>
      </section>

      {showExitModal && (
        <OnboardingExitModal
          onConfirm={handleExitConfirm}
          onCancel={handleExitCancel}
          isSubmitting={isFinishing}
        />
      )}
    </div>
  )
}

export default OnboardingPage
