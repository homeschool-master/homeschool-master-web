export interface GradeLevelOption {
  value: string
  label: string
}

export interface StudentColorOption {
  value: string
  label: string
  hex: string
}


export const GRADE_LEVELS: GradeLevelOption[] = [
  { value: 'pre-k', label: 'Pre-K' },
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: '1', label: '1st Grade' },
  { value: '2', label: '2nd Grade' },
  { value: '3', label: '3rd Grade' },
  { value: '4', label: '4th Grade' },
  { value: '5', label: '5th Grade' },
  { value: '6', label: '6th Grade' },
  { value: '7', label: '7th Grade' },
  { value: '8', label: '8th Grade' },
  { value: '9', label: '9th Grade' },
  { value: '10', label: '10th Grade' },
  { value: '11', label: '11th Grade' },
  { value: '12', label: '12th Grade' },
]

export const STUDENT_COLORS: StudentColorOption[] = [
  { value: 'amber', label: 'Amber', hex: '#d97b0a' },
  { value: 'red', label: 'Red', hex: '#dc2626' },
  { value: 'green', label: 'Green', hex: '#16a34a' },
  { value: 'teal', label: 'Teal', hex: '#0d9488' },
  { value: 'blue', label: 'Blue', hex: '#2563eb' },
  { value: 'purple', label: 'Purple', hex: '#7c3aed' },
  { value: 'pink', label: 'Pink', hex: '#db2777' },
  { value: 'slate', label: 'Slate', hex: '#475569' },
  { value: 'burnt-orange', label: 'Burnt Orange', hex: '#bc5b22' },
  { value: 'maroon', label: 'Maroon', hex: '#7a322d' },
  { value: 'mustard', label: 'Golden Mustard', hex: '#c08b26' },
  { value: 'taupe', label: 'Taupe', hex: '#67482c' },
  { value: 'olive', label: 'Olive', hex: '#796123' },
]

// Bounds for the "How many students?" number input on onboarding step 2.
export const MIN_STUDENTS = 1
