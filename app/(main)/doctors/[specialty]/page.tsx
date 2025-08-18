"use client";

import { useEffect, useState } from "react";
import { getDoctorsBySpecialty } from "@/actions/doctor";
import DoctorCard from "@/components/doctorCard";
import PageHeader from "@/components/page.header";
import { redirect, useParams } from "next/navigation";

export default function SpecialtyPage() {
  const params = useParams();
  const { specialty } = params;

  const [doctors, setDoctors] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      if (!specialty) {
        redirect("/doctors");
        return;
      }

      try {
        const specialtyString = Array.isArray(specialty)
          ? specialty.join(" ")
          : specialty;

        const { doctors, error } = await getDoctorsBySpecialty(specialtyString);

        if (error) {
          setError(error);
        } else {
          setDoctors(doctors || []);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [specialty]);

  const specialtyString = Array.isArray(specialty)
    ? specialty.join(" ")
    : specialty;

  if (loading) {
    return <p className="text-center py-12">Loading doctors...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialtyString?.split("%20").join(" ")}
        backLink="/doctors"
        backLabel="All Specialists"
      />

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No doctors found for this specialty.
          </h3>
          <p className="text-muted-foreground">
            Please check back later or choose a different specialty.
          </p>
        </div>
      )}
    </div>
  );
}
