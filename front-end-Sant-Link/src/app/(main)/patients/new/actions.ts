
'use server';

import type { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Patient } from '@/types';
import { PatientFormSchema, type PatientFormData } from './schema'; // Import from schema.ts

interface SavePatientResult {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
  patientId?: string;
}

// Mock de la base de données des patients (pour simulation)
const mockPatientsDB: Patient[] = [];

export async function savePatientAction(data: PatientFormData): Promise<SavePatientResult> {
  // Correct order for optional fields with .max: .max().optional().default()
  const CorrectedPatientFormSchema = z.object({
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


  const validationResult = CorrectedPatientFormSchema.safeParse(data);


  if (!validationResult.success) {
    console.error("Erreurs de validation (patient):", validationResult.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Les données du formulaire sont invalides. Veuillez corriger les erreurs.",
      errors: validationResult.error.issues,
    };
  }

  const validatedData = validationResult.data;
  console.log("Tentative d'enregistrement du patient (simulation):", validatedData);

  try {
    // Simulation d'une opération de base de données
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPatientId = `PAT${String(mockPatientsDB.length + 1).padStart(3, '0')}`;
    const newPatient: Patient = {
      id: newPatientId,
      name: validatedData.name,
      dateOfBirth: validatedData.dateOfBirth,
      gender: validatedData.gender,
      contact: validatedData.contact,
      phone: validatedData.phone,
      address: validatedData.address,
      medicalHistorySummary: validatedData.medicalHistorySummary,
      status: validatedData.status,
      avatarUrl: `https://placehold.co/100x100.png?text=${validatedData.name.substring(0,2).toUpperCase()}`,
      emergencyContact: {
        name: validatedData.emergencyContactName || "",
        relationship: validatedData.emergencyContactRelationship || "",
        phone: validatedData.emergencyContactPhone || "",
      },
      insurance: {
        provider: validatedData.insuranceProvider || "",
        policyNumber: validatedData.insurancePolicyNumber || "",
      },
      medicalHistory: [],
      appointments: [],
      prescriptions: [],
      alerts: [],
    };
    
    mockPatientsDB.push(newPatient); // Ajout au mock DB
    console.log(`Patient ${newPatientId} (${validatedData.name}) enregistré (simulation). Prochain ID: PAT${String(mockPatientsDB.length + 1).padStart(3, '0')}`);

    revalidatePath('/patients');
    revalidatePath('/dashboard'); // Si les infos patients y sont affichées

    return {
      success: true,
      message: "Patient enregistré avec succès.",
      patientId: newPatientId
    };

  } catch (error) {
    console.error("Erreur serveur lors de l'enregistrement du patient:", error);
    return {
      success: false,
      message: "Une erreur interne est survenue lors de l'enregistrement. Veuillez réessayer."
    };
  }
}
