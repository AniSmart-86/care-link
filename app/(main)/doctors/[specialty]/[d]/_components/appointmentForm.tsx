"use client";

import { bookAppointment } from "@/actions/appointments";
import { Slot } from "@/app/(main)/doctor/_components/availabilitySetting";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";



type Props = {
  doctorId: string;
  slot: {
    startTime: string;
    endTime: string;
    formatted: string;
  };
  onBack: () => void;
  onComplete: () => void;
};

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }: Props) => {
  const [description, setDescription] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    await submitBooking(formData);
  };

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Appointment booked successfully!");
        onComplete();
      }
    }
  }, [data]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center">
          <Clock className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white">{slot.formatted}</span>
        </div>

        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">2 credits</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="description">
          Describe your medical concern (optional)
        </Label>

        <Textarea
          id="description"
          placeholder="Please provide any details about your medical concern..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background border-emerald-900/20 h-32"
        />

        <p className="text-xs text-muted-foreground">
          This information will be shared with the doctor before your
          appointment.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant={"outline"}
          onClick={onBack}
          disabled={loading}
          className="border-emerald-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>

        <Button
          type="submit"
          variant={"outline"}
          onClick={onBack}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
