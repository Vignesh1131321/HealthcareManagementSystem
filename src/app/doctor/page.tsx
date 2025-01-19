import Doctor from "../components/Doctor";
import AppointmentFailure from "../components/AppointmentFailure";
import { NavbarWrapper } from "../healthcare/components/NavbarWrapper";
export default function ChatbotPage() {
    return (
      <div>
        
        <Doctor specialty={"cardiologist"}/>
        {/* <AppointmentFailure></AppointmentFailure> */}
      </div>
  
    );
  }