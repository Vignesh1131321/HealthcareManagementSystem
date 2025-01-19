import DoctorAppointments from "../components/DoctorAppointments";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
export default function ChatbotPage() {
    return (
      <div>
        <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)"/>
        <DoctorAppointments />
        {/* <AppointmentFailure></AppointmentFailure> */}
      </div>
  
    );
  }