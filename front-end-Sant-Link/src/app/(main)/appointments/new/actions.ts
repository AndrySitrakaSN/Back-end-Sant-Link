
'use server';

import type { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Appointment } from '@/types';
import { AppointmentFormSchema, type AppointmentFormData } from './schema'; // Import from schema.ts

interface SaveAppointmentResult {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
  appointmentId?: string;
}

// Mock de la base de données des rendez-vous (pour simulation)
const mockAppointmentsDB: Appointment[] = [];

export async function saveAppointmentAction(data: AppointmentFormData): Promise<SaveAppointmentResult> {
  const validationResult = AppointmentFormSchema.safeParse(data);

  if (!validationResult.success) {
    console.error("Erreurs de validation (rendez-vous):", validationResult.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Les données du formulaire sont invalides. Veuillez corriger les erreurs.",
      errors: validationResult.error.issues,
    };
  }

  const validatedData = validationResult.data;

  console.log("Tentative de sauvegarde du rendez-vous (simulation):", validatedData);

  try {
    // Simulation d'une opération de base de données
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAppointmentId = `APT${String(mockAppointmentsDB.length + 1).padStart(3, '0')}`;
    const newAppointment: Appointment = {
      id: newAppointmentId,
      ...validatedData,
      status: "Programmé", // Statut par défaut pour un nouveau rendez-vous
    };

    mockAppointmentsDB.push(newAppointment); // Ajout au mock DB (pour la simulation)
    console.log(`Rendez-vous ${newAppointmentId} enregistré (simulation) pour ${validatedData.patientName}. Prochain ID: APT${String(mockAppointmentsDB.length + 1).padStart(3, '0')}`);


    revalidatePath('/appointments');
    revalidatePath('/dashboard'); // Si les rendez-vous y sont affichés

    return {
      success: true,
      message: "Rendez-vous planifié avec succès.",
      appointmentId: newAppointmentId
    };

  } catch (error) {
    console.error("Erreur serveur lors de la sauvegarde du rendez-vous:", error);
    return {
      success: false,
      message: "Une erreur interne est survenue lors de la planification. Veuillez réessayer."
    };
  }
}
