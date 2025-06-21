
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Masculin' | 'Féminin' | 'Autre';
  contact: string; // email
  phone?: string;
  address: string;
  medicalHistorySummary: string;
  status: 'Actif' | 'Inactif' | 'En attente';
  avatarUrl?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
  };
  medicalHistory: MedicalEntry[];
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  alerts?: PatientAlert[];
}

export interface MedicalEntry {
  id: string;
  date: string; // ISO string
  type: 'Consultation' | 'Vaccination' | 'Examen' | 'Note' | 'Admission' | 'Sortie'; // French for display
  summary: string;
  details?: string;
  doctor?: string; // Doctor's name or ID
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  status: 'Programmé' | 'Terminé' | 'Annulé' | 'Replanifié' | 'Absent'; // French for display
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty?: string; // Made optional as it wasn't in mock data for appointment page.
  contact?: string;
  availability?: string; // Could be more complex
}

export interface HealthMetric {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  date: string; // ISO string for last updated
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency?: string;
  duration: string;
  datePrescribed: string; // YYYY-MM-DD
  prescribingDoctor?: string;
  notes?: string;
}

export interface PatientAlert {
  id: string;
  type: 'Allergie' | 'Rappel de médicament' | 'Condition critique' | 'Suivi requis' | 'Note'; // French for display
  severity: 'Élevée' | 'Moyenne' | 'Faible' | 'Info'; // French for display
  description: string;
  dateNoted: string; // YYYY-MM-DD
  resolved?: boolean;
  resolvedDate?: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Agent'; // Using English for roles internally for simplicity
  avatarUrl?: string;
}

