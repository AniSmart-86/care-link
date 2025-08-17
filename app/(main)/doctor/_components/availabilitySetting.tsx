"use client";

import { setAvailabilitySlots } from "@/actions/doctor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetch";
import { AlertCircle, Clock, Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns"; 

// Slot type for a single slot
export type Slot = {
  id: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  doctorId?: string;
  status?: "AVAILABLE" | "BOOKED" | "BLOCKED";
  appointment?: any[];
};

// Props for the component
interface AvailabilitySettingProps {
  slots: Slot[];
}

// Form values type
interface SlotFormValues {
  startTime: string;
  endTime: string;
}

const AvailabilitySetting: React.FC<AvailabilitySettingProps> = ({ slots }) => {
  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SlotFormValues>({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  /**
   * Creates a new Date object with the given time string set as the time,
   * and the current date.
   *
   * @param {string} timeStr - A string representing the time in the format "HH:mm".
   * @return {Date} A new Date object with the given time and the current date.
   */
  function createLocalDateFromTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }

  function formatTimeString(dateString: string): string {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid time";
    }
  }

  const onSubmit = async (formValues: SlotFormValues) => {
    if (loading) return;

    const startDate = createLocalDateFromTime(formValues.startTime);
    const endDate = createLocalDateFromTime(formValues.endTime);

    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }

    const formData = new FormData();
    formData.append("startTime", startDate.toISOString());
    formData.append("endTime", endDate.toISOString());

    await submitSlots(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowForm(false);
      toast.success("Availability slot saved successfully");
    }
    console.log(data);
  }, [data]);

  return (
    <Card className="border-emerald-900/20">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-white flex items-center justify-center">
          <Clock className="h-5 w-5 mr-2 text-emerald-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your availability slots for appointments.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!showForm ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">
                Current Availability
              </h3>
              {slots.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  You haven’t set any availability slots yet. Add your
                  availability to start accepting appointments.
                </p>
              ) : (
                <div>
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20"
                    >
                      <div className="bg-emerald-900/20 p-2 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="text-white font-medium">
                        {formatTimeString(slot.startTime)} -{" "}
                        {formatTimeString(slot.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Set Time
            </Button>
          </>
        ) : (
          <form
            className="space-y-4 border border-emerald-900/20 rounded-md p-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-6">
              Set Daily Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  className="bg-background border-emerald-800"
                />
                {errors.startTime && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register("endTime", {
                    required: "End time is required",
                  })}
                  className="bg-background border-emerald-800 mt-1.5"
                />
                {errors.endTime && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                disabled={loading}
                type="button"
                className="border-emerald-900/30"
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                disabled={loading}
                type="submit"
                className="border-emerald-900/30 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 bg-amber-900/50 border border-amber-400 rounded-md">
          <h4 className="font-bold text-white mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-400 font-bold" />
            How It Works
          </h4>
          <p className="text-xs text-muted-foreground">
            Set your daily availability for appointments. This will help
            patients book appointments during your available hours. The same
            availability applies to all days. You can update at any time, but
            existing booked appointments will remain unchanged.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySetting;
