import { PROFILE_CONTENT } from '../../constants/profile'

interface ScopeNoticeProps {
  /** Whose items are on screen right now. */
  scopeLabel: string
  /** Nothing is narrowing the view, so the line has nothing to say. */
  scopeIsDefault: boolean
  /** The profile being overridden, and null while the two agree. */
  profileLabel: string | null
  onResetToProfile: () => void
  /** The URL names students the roster does not have. */
  unknownCount: number
  onResetToDefault: () => void
  className: string
}

/**
 * Says whose items a view is showing, and offers the way back when that is
 * not the profile. Shared by the calendar and the tasks page so the two report
 * the same thing in the same words.
 *
 * Deliberately never inside a collapsible panel. At phone width those are shut
 * by default, and a view showing a third of its rows has to say why without
 * being opened first.
 */
const ScopeNotice = ({
  scopeLabel,
  scopeIsDefault,
  profileLabel,
  onResetToProfile,
  unknownCount,
  onResetToDefault,
  className,
}: ScopeNoticeProps) => (
  <>
    {unknownCount > 0 && (
      <p className={`${className}__unknown`} role='status'>
        <strong>
          {unknownCount === 1 ? PROFILE_CONTENT.unknownHeading : PROFILE_CONTENT.unknownHeadingMany}
        </strong>{' '}
        {PROFILE_CONTENT.unknownNote}{' '}
        <button type='button' className={`${className}__reset`} onClick={onResetToDefault}>
          {PROFILE_CONTENT.unknownReset}
        </button>
      </p>
    )}

    <p className={`${className}__scope${scopeIsDefault ? ` ${className}__scope--default` : ''}`}>
      <span className={`${className}__scope-label`}>{PROFILE_CONTENT.viewing}:</span>{' '}
      <strong className={`${className}__scope-value`}>{scopeLabel}</strong>
      {profileLabel !== null && (
        <>
          {' '}
          <span className={`${className}__scope-note`}>
            {PROFILE_CONTENT.overrideSuffix}. {PROFILE_CONTENT.profile}: {profileLabel}.
          </span>{' '}
          <button
            type='button'
            className={`${className}__reset`}
            onClick={onResetToProfile}
            aria-label={PROFILE_CONTENT.resetLabel}
          >
            {PROFILE_CONTENT.reset}
          </button>
        </>
      )}
    </p>
  </>
)

export default ScopeNotice
