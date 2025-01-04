export interface GoogleSignUpProps {
  onSignUp: () => void;
}
export interface EmailSignUpProps {
  onSubmit: (username: string, email: string, password: string, confirmPassword: string) => void;
}

export interface SignUpFormProps {
  onEmailSignUp: (username: string, email: string, password: string, confirmPassword: string) => void;
}


export interface TermsAndPrivacyProps {
  className?: string;
}
