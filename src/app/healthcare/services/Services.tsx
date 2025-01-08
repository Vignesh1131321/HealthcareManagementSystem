// import React from "react";
// import styles from "./Services.module.css";
// import { ServiceCard } from "./ServiceCard";
// import { ServiceCardProps } from "./types";

// const servicesData: ServiceCardProps[] = [
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/bcc86c97d2a1f454d7c56a4523ae36991114bba3b55e0249dce5b16e730bc59c?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Search doctor icon",
//     title: "Search doctor",
//     description:
//       "Choose your doctor from thousands of specialist, general, and trusted hospitals",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/f603194c42343420fed615c51e0db10a9d2c74dc1a226b34282f2993e7b9d15f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Online pharmacy icon",
//     title: "Online pharmacy",
//     description:
//       "Buy your medicines with our mobile application with a simple delivery system",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/9669e28a94a0712decf9cf2aea791a4844a0b2ba5275c0d4c287673faf5bcd92?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Consultation icon",
//     title: "Consultation",
//     description:
//       "Free consultation with our trusted doctors and get the best recomendations",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/15c5bf4fcde5830907277032315d66226187cd0422f88a1e1726a4fd9f7b6645?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Details info icon",
//     title: "Details info",
//     description:
//       "Free consultation with our trusted doctors and get the best recomendations",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/ed902067d3d4dfa717efa5aa3ca976f534514db1426e550709c377f4648c727a?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Emergency care icon",
//     title: "Emergency care",
//     description:
//       "You can get 24/7 urgent care for yourself or your children and your lovely family",
//   },
//   {
//     imageSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/9d89bab03ab543406445b1ea0544a233d317412dc0a7e20834b16dff0deeeee2?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
//     imageAlt: "Tracking icon",
//     title: "Tracking",
//     description: "Track and save your medical history and health data",
//   },
// ];
// export const Services: React.FC = () => {
//   return (
//     <div className={styles.servicesContainer}>
//       {servicesData.map((service, index) => (
//         <div key={index} className={styles.serviceColumn}>
//           <ServiceCard {...service} />
//         </div>
//       ))}
//     </div>
//   );
// };
"use client"
import React, { useState } from "react";
import styles from "./Services.module.css";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardProps } from "./types";
import { DoctorModal } from "./DoctorModal";

const servicesData: ServiceCardProps[] = [
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bcc86c97d2a1f454d7c56a4523ae36991114bba3b55e0249dce5b16e730bc59c?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Search doctor icon",
    title: "Search doctor",
    description:
      "Choose your doctor from thousands of specialist, general, and trusted hospitals",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f603194c42343420fed615c51e0db10a9d2c74dc1a226b34282f2993e7b9d15f?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Online pharmacy icon",
    title: "Online pharmacy",
    description:
      "Buy your medicines with our mobile application with a simple delivery system",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9669e28a94a0712decf9cf2aea791a4844a0b2ba5275c0d4c287673faf5bcd92?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Consultation icon",
    title: "Consultation",
    description:
      "Free consultation with our trusted doctors and get the best recommendations",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/15c5bf4fcde5830907277032315d66226187cd0422f88a1e1726a4fd9f7b6645?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Details info icon",
    title: "Details info",
    description:
      "Free consultation with our trusted doctors and get the best recommendations",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/ed902067d3d4dfa717efa5aa3ca976f534514db1426e550709c377f4648c727a?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Emergency care icon",
    title: "Emergency care",
    description:
      "You can get 24/7 urgent care for yourself or your children and your lovely family",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9d89bab03ab543406445b1ea0544a233d317412dc0a7e20834b16dff0deeeee2?placeholderIfAbsent=true&apiKey=47664af269c84f519addca9fde036b21",
    imageAlt: "Tracking icon",
    title: "Tracking",
    description: "Track and save your medical history and health data",
  },
];

export const Services: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to handle "Search doctor" card click
  const handleFindDoctorClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={styles.servicesContainer}>
      {servicesData.map((service, index) => (
        <div key={index} className={styles.serviceColumn}>
          <ServiceCard
            {...service}
            onClick={service.title === "Search doctor" ? handleFindDoctorClick : undefined} 
          />
        </div>
      ))}
      {isModalOpen && <DoctorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
