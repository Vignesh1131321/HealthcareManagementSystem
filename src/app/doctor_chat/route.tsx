import DoctorChat from "../components/DoctorChat";
import Header from "../components/Header";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
export default function ChatbotPage() {
    return (
      <div>
        <NavbarWrapper/>
        <DoctorChat />
      </div>
  
    );
  }