import AppointmentPage from "../components/AppointmentPage";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
export default function Appointment() {
    return (
      <div>
        <NavbarWrapper backgroundColor="rgb(195, 197, 218, 0.6)"/>
        <AppointmentPage ></AppointmentPage>
      </div>
  
    );
  }