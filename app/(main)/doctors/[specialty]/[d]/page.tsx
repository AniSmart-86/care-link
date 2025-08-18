"use client";

import { useParams, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getAvailableTimeSlots, getDoctorById } from "@/actions/appointments";
import DoctorsProfile from "./_components/doctorsProfile";

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!id) {
          redirect("/doctors");
          return;
        }

        const [doctorData, slotsData] = await Promise.all([
          getDoctorById(id),
          getAvailableTimeSlots(id),
        ]);

        if (!doctorData?.doctor) {
          redirect("/doctors");
        } else {
          setDoctor(doctorData.doctor);
          setDays(slotsData.days || []);
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error);
        redirect("/doctors");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p>Loading doctor profile...</p>;

  if (!doctor) return null;

  return <DoctorsProfile doctor={doctor} availableDays={days} />;
}
