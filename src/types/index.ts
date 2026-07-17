export interface User {
  id: string
  email: string
  firstName: string
  middleName: string | null
  lastName: string
  notifyAccountUpdates: boolean
  notifyProductUpdates: boolean
  notifyHomeschoolResources: boolean
  onboardingCompleted: boolean
}