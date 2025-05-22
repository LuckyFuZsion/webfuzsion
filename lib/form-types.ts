export type FormErrors = {
  name?: string[]
  email?: string[]
  subject?: string[]
  message?: string[]
  enquiryType?: string[]
  recaptchaToken?: string[]
}

export type FormState = {
  success: boolean
  message: string
  errors?: FormErrors
}

export const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
}
