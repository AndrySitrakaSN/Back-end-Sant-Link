
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAppointmentAction } from './actions';
import { AppointmentFormSchema, type AppointmentFormData } from './schema'; // Import from schema.ts
import type { Patient, Doctor } from "@/types";

// Mock data (remplacer par des données réelles ou des appels API si nécessaire)
const mockPatients: Pick<Patient, 'id' | 'name'>[] = [
  { id: "PAT001", name: "Alice Wonderland" },
  { id: "PAT002", name: "Robert Smith" },
  { id: "PAT003", name: "Charles Xavier" },
];

const mockDoctors: Pick<Doctor, 'id' | 'name'>[] = [
  { id: "DOC001", name: "Dr. Smith" },
  { id: "DOC002", name: "Dr. Jones" },
  { id: "DOC003", name: "Dr. Strange" },
];


export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId");
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, watch } = useForm<AppointmentFormData>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      patientId: preselectedPatientId || "",
      patientName: preselectedPatientId ? mockPatients.find(p => p.id === preselectedPatientId)?.name || "" : "",
      doctorId: "",
      doctorName: "",
      date: new Date().toISOString().split('T')[0],
      time: "",
      reason: "",
      notes: "",
    }
  });

  const selectedPatientId = watch("patientId");
  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    if (preselectedPatientId && !selectedPatientId) {
      setValue("patientId", preselectedPatientId);
      const patient = mockPatients.find(p => p.id === preselectedPatientId);
      if (patient) {
        setValue("patientName", patient.name);
      }
    }
  }, [preselectedPatientId, setValue, selectedPatientId]);

  useEffect(() => {
    const patient = mockPatients.find(p => p.id === selectedPatientId);
    if (patient) {
      setValue("patientName", patient.name);
    } else if (selectedPatientId === "") { // Clear name if patient is deselected
        setValue("patientName", "");
    }
  }, [selectedPatientId, setValue]);

  useEffect(() => {
    const doctor = mockDoctors.find(d => d.id === selectedDoctorId);
    if (doctor) {
      setValue("doctorName", doctor.name);
    } else if (selectedDoctorId === "") { // Clear name if doctor is deselected
        setValue("doctorName", "");
    }
  }, [selectedDoctorId, setValue]);

  const onSubmit = async (data: AppointmentFormData) => {
    const result = await saveAppointmentAction(data);

    if (result.success) {
      toast({
        title: "Rendez-vous planifié",
        description: result.message,
        variant: "default",
      });
      router.push("/appointments");
    } else {
      let errorMsg = result.message;
      if (result.errors) {
         // Les erreurs par champ sont déjà gérées par react-hook-form
         // errorMsg = "Veuillez corriger les erreurs dans le formulaire.";
      }
      toast({
        title: "Erreur de planification",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="font-headline text-3xl font-bold">Planifier un nouveau rendez-vous</h1>
        <div className="w-[88px]"></div> {/* Placeholder for balance */}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Détails du nouveau rendez-vous</CardTitle>
          <CardDescription>Remplissez les informations pour planifier un nouveau rendez-vous.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientId">Patient</Label>
                <Controller
                  name="patientId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!preselectedPatientId}>
                      <SelectTrigger id="patientId">
                        <SelectValue placeholder="Sélectionner un patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.patientId && <p className="text-sm text-destructive mt-1">{errors.patientId.message}</p>}
                <input type="hidden" {...register("patientName")} />
              </div>

              <div>
                <Label htmlFor="doctorId">Médecin</Label>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="doctorId">
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.doctorId && <p className="text-sm text-destructive mt-1">{errors.doctorId.message}</p>}
                 <input type="hidden" {...register("doctorName")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Date du rendez-vous</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <Label htmlFor="time">Heure du rendez-vous</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                />
                {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Motif du rendez-vous</Label>
              <Textarea
                id="reason"
                placeholder="ex: Consultation de suivi, Nouveau symptôme..."
                {...register("reason")}
                rows={3}
              />
              {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajouter des notes ou commentaires supplémentaires..."
                {...register("notes")}
                rows={3}
              />
              {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Planification...
                  </div>
                ) : (
                  <>
                    <CalendarPlus className="mr-2 h-5 w-5" /> Planifier le rendez-vous
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
