export type FormErrors = {
  name?: string[]
  email?: string[]
  subject?: string[]
  message?: string[]
  enquiryType?: string[]
  recaptchaToken?: string[]
}

export interface FormState {
  success?: boolean
  message?: string
  errors?: {
    [key: string]: string[]
  }
}

export const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
}
