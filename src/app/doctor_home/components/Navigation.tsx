// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import styles from "../styles/Navigation.module.css";
// import { NavigationItemProps } from "../types";

// const navigationItems: NavigationItemProps[] = [
//   { text: "Home", link: "/" },
//   /* { text: "Find Doctor", link: "/doctor" }, */
//   // { text: "Find Hospitals", link: "/hospitals" },
//   { text: "Appointments", link: "/doctor_home/doctor_appointments" },
//   { text: "Profile", link: "/doctor_home/doctor-profile" },
// ];

// export const Navigation: React.FC = () => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   // Update active index on hover and click
//   const handleMouseEnter = (index: number) => setActiveIndex(index);
//   const handleMouseLeave = () => setActiveIndex(null);

//   const handleClick = (index: number) => {
//     setActiveIndex(index);
//   };

//   return (
//     <nav className={styles.nav}
    
//     >
//       {navigationItems.map((item, index) => (
//         <div
//           key={index}
//           className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
//           onMouseEnter={() => handleMouseEnter(index)}
//           onMouseLeave={handleMouseLeave}
//           onClick={() => handleClick(index)}  // Add onClick to highlight the item
//         >
//           <Link href={item.link || "#"} className={styles.navLink}>
//             {item.text}
//           </Link>
//           {item.dropdown && activeIndex === index && (
//             <div className={styles.dropdown}>
//               {item.dropdown.map((option, optionIndex) => (
//                 <div key={optionIndex} className={styles.dropdownItem}>
//                   {option}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </nav>
//   );
// };


"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Navigation.module.css";
import { Menu, X } from "lucide-react";
import { NavigationItemProps } from "../types";

const navigationItems: NavigationItemProps[] = [
  { text: "Home", link: "/" },
  /* { text: "Find Doctor", link: "/doctor" }, */
  // { text: "Find Hospitals", link: "/hospitals" },
  { text: "Appointments", link: "/doctor_home/doctor_appointments" },
  { text: "Profile", link: "/doctor_home/doctor-profile" },
];

export const Navigation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);
  const handleClick = (index: number) => setActiveIndex(index);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className={styles.navigationWrapper}>
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X size={24} className={styles.menuIcon} />
        ) : (
          <Menu size={24} className={styles.menuIcon} />
        )}
      </button>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              handleClick(index);
              setIsMobileMenuOpen(false);
            }}
          >
            <Link href={item.link || "#"} className={styles.navLink}>
              {item.text}
            </Link>
            {item.dropdown && activeIndex === index && (
              <div className={styles.dropdown}>
                {item.dropdown.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.dropdownItem}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};