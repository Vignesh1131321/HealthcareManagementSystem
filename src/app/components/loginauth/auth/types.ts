export interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  showHidePassword?: boolean;
}

export interface SocialButtonProps {
  icon: string;
  text: string;
  onClick: () => void;
}

export interface DividerProps {
  text: string;
}
