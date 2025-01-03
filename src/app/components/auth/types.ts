export interface GoogleSignUpProps {
  onSignUp: () => void;
}

export interface EmailSignUpProps {
  onSubmit: (email: string) => void;
}

export interface SignUpFormProps {
  onGoogleSignUp: () => void;
  onEmailSignUp: (email: string) => void;
}

export interface TermsAndPrivacyProps {
  className?: string;
}