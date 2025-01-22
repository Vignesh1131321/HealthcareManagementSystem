export interface NavigationItemProps {
  text: string;
  isActive?: boolean;
  dropdown?: string[]; 
  link?: string; // Add the link property
}

export interface LogoProps {
  letter: string;
  text: string;
}

export interface HeroContentProps {
  title: React.ReactNode;
  description: string;
  buttonText: string;
}
