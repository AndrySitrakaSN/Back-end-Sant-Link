
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Schéma de validation pour les données du formulaire de consultation (définie ici, non exportée)
const ConsultationFormSchema = z.object({
  patientId: z.string().nullable().optional(),
  consultationDate: z.string().min(1, "La date de consultation est requise."),
  doctorId: z.string().min(1, "Le médecin consultant est requis."),
  reason: z.string().min(1, "Le motif de la visite est requis.").max(255, "Le motif ne doit pas dépasser 255 caractères."),
  symptoms: z.string().max(2000, "Les symptômes ne doivent pas dépasser 2000 caractères.").optional().default(""),
  diagnosis: z.string().min(1, "Le diagnostic est requis.").max(2000, "Le diagnostic ne doit pas dépasser 2000 caractères."),
  treatmentPlan: z.string().max(2000, "Le plan de traitement ne doit pas dépasser 2000 caractères.").optional().default(""),
  notes: z.string().max(2000, "Les notes ne doivent pas dépasser 2000 caractères.").optional().default(""),
});

// Type pour les données du formulaire, toujours exporté pour être utilisé par le composant page
export type ConsultationFormData = z.infer<typeof ConsultationFormSchema>;

// Interface pour le résultat de la sauvegarde (usage interne à ce fichier)
interface SaveConsultationResult {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function saveConsultationAction(data: ConsultationFormData): Promise<SaveConsultationResult> {
  const validationResult = ConsultationFormSchema.safeParse(data); // Utilisation du schéma interne

  if (!validationResult.success) {
    console.error("Erreurs de validation:", validationResult.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Les données du formulaire sont invalides. Veuillez corriger les erreurs et réessayer.",
      errors: validationResult.error.issues,
    };
  }

  const validatedData = validationResult.data;

  console.log("Tentative de sauvegarde de la consultation (simulation) avec les données validées:", validatedData);

  // Simulation d'une opération de base de données
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simule la latence du réseau/DB
    
    console.log(`Consultation pour le patient ${validatedData.patientId || 'N/A'} enregistrée (simulation).`);

    // Revalider les chemins pour mettre à jour les données affichées après la sauvegarde
    if (validatedData.patientId) {
      revalidatePath(`/patients/${validatedData.patientId}`);
      revalidatePath(`/patients/${validatedData.patientId}?tab=history`); 
    }
    revalidatePath('/consultations/history'); 

    return { success: true, message: "Consultation enregistrée avec succès." };

  } catch (error) {
    console.error("Erreur serveur lors de la sauvegarde de la consultation:", error);
    return { success: false, message: "Une erreur interne est survenue lors de la sauvegarde. Veuillez réessayer." };
  }
}
