
import { z } from 'zod';

export const PatientFormSchema = z.object({
  name: z.string().min(2, "Le nom est requis (minimum 2 caractères).").max(100, "Le nom ne doit pas dépasser 100 caractères."),
  dateOfBirth: z.string().min(1, "La date de naissance est requise."),
  gender: z.enum(['Masculin', 'Féminin', 'Autre'], { required_error: "Le genre est requis." }),
  contact: z.string().email("Format d'e-mail invalide.").min(1, "L'e-mail est requis."),
  phone: z.string().max(20, "Le téléphone ne doit pas dépasser 20 caractères.").optional().default(""),
  address: z.string().min(1, "L'adresse est requise.").max(255, "L'adresse ne doit pas dépasser 255 caractères."),
  medicalHistorySummary: z.string().max(2000, "Le résumé des antécédents ne doit pas dépasser 2000 caractères.").optional().default(""),
  status: z.enum(['Actif', 'Inactif', 'En attente'], { required_error: "Le statut est requis." }),
  emergencyContactName: z.string().max(100).optional().default(""),
  emergencyContactRelationship: z.string().max(50).optional().default(""),
  emergencyContactPhone: z.string().max(20).optional().default(""),
  insuranceProvider: z.string().max(100).optional().default(""),
  insurancePolicyNumber: z.string().max(100).optional().default(""),
});

export type PatientFormData = z.infer<typeof PatientFormSchema>;
