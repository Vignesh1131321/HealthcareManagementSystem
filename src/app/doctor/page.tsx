import Doctor from "../components/Doctor";
import AppointmentFailure from "../components/AppointmentFailure";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
export default function ChatbotPage() {
    return (
      <div>
        <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)"/>
        <Doctor specialty="Cardiologist"/>
        {/* <AppointmentFailure></AppointmentFailure> */}
      </div>
  
    );
  }