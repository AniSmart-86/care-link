import { getDoctorById } from "@/actions/appointments";
import PageHeader from "@/components/page.header";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const { id } = params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) {
    return { title: "Doctor not found - DocLink" };
  }

  return {
    title: `Dr. ${doctor.name} - DocLink`,
    description: `Book with Dr. ${doctor.name}, ${doctor.specialty}`,
  };
}

export default async function DoctorProfileLayout({ children, params }: Props) {
  const { id } = params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto">
      <PageHeader
        title={`Dr. ${doctor.name}`}
        backLink={`/doctors/${doctor.specialty}`}
        backLabel={`Back to ${doctor.specialty}`}
      />
      {children}
    </div>
  );
}
