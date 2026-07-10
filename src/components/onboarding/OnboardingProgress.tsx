interface OnboardingProgressProps {
  step: number
  totalSteps: number
}

const OnboardingProgress = ({ step, totalSteps }: OnboardingProgressProps) => {
  const percent = Math.min(100, Math.round((step / totalSteps) * 100))

  return (
    <div className='onboarding-progress'>
      <span className='onboarding-progress__label'>Progress</span>
      <div
        className='onboarding-progress__track'
        role='progressbar'
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${step} of ${totalSteps}`}
      >
        <div className='onboarding-progress__fill' style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default OnboardingProgress
