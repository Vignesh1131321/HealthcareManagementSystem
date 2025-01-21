import { IconType } from "react-icons"; 
export interface ServiceCardProps {
  icon?: IconType;  
  imageSrc?: string;
  imageAlt: string;
  title: string;
  description: string;
  onClick?: () => void; // Add this line to allow an optional onClick function
}
