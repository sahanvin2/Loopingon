import { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers - Join Our Mission",
  description: "Join the Kandyam team and help connect digital creators with the world. Explore open positions in Rambukkana, Kegalle.",
};

export default function CareersPage() {
  return <CareersClient />;
}
