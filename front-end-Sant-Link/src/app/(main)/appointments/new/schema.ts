
import { z } from 'zod';

export const AppointmentFormSchema = z.object({
  patientId: z.string().min(1, "L'ID du patient est requis."),
  patientName: z.string().min(1, "Le nom du patient est requis."),
  doctorId: z.string().min(1, "L'ID du médecin est requis."),
  doctorName: z.string().min(1, "Le nom du médecin est requis."),
  date: z.string().min(1, "La date du rendez-vous est requise."),
  time: z.string().min(1, "L'heure du rendez-vous est requise.")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)."),
  reason: z.string().min(1, "Le motif du rendez-vous est requis.").max(500, "Le motif ne doit pas dépasser 500 caractères."),
  notes: z.string().max(2000, "Les notes ne doivent pas dépasser 2000 caractères.").optional().default(""),
});

export type AppointmentFormData = z.infer<typeof AppointmentFormSchema>;
