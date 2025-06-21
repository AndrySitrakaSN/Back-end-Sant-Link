"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, PlusCircle, Mail, Phone, MapPin, CalendarIcon, User, ShieldAlert, FileText, Pill, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Patient, MedicalEntry, Appointment, Prescription, PatientAlert as PatientAlertType } from "@/types"; 
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import Image from "next/image";

const mockPatientData: Record<string, Patient> = {
  "PAT001": {
    id: "PAT001", name: "Alice Wonderland", dateOfBirth: "1990-05-15", gender: "Féminin", 
    contact: "alice@example.com", phone: "555-0101",
    address: "123 Fantasy Lane, Storyville, ST 12345", 
    medicalHistorySummary: "Allergies : Pollen. Antécédents : Asthme léger (enfance).",
    status: "Actif",
    avatarUrl: "https://placehold.co/100x100.png?text=AW",
    emergencyContact: { name: "Mad Hatter", relationship: "Ami(e)", phone: "555-0102" },
    insurance: { provider: "WonderHealth", policyNumber: "WH123456789" },
    medicalHistory: [
      { id: "MH001", date: "2023-01-10", type: "Consultation", summary: "Bilan annuel", doctor: "Dr. Smith", details: "Bilan de routine, tous les signes vitaux normaux." },
      { id: "MH002", date: "2023-03-15", type: "Vaccination", summary: "Vaccin antigrippal", doctor: "Infirmière Joy", details: "Vaccin antigrippal administré." },
      { id: "MH003", date: "2023-06-20", type: "Consultation", summary: "Mal de gorge", doctor: "Dr. Smith", details: "Antibiotiques prescrits pour angine streptococcique." },
    ],
    appointments: [
      { id: "APT010", patientId: "PAT001", patientName: "Alice Wonderland", doctorId: "DOC001", doctorName: "Dr. Smith", date: "2024-07-15", time: "10:00", reason: "Suivi", status: "Programmé" },
      { id: "APT011", patientId: "PAT001", patientName: "Alice Wonderland", doctorId: "DOC002", doctorName: "Dr. Jones", date: "2024-06-20", time: "14:30", reason: "Contrôle dentaire", status: "Terminé" },
    ],
    prescriptions: [
      { id: "PRE001", medication: "Amoxicilline 250mg", dosage: "1 comprimé 3 fois par jour", duration: "7 jours", datePrescribed: "2023-06-20" },
      { id: "PRE002", medication: "Inhalateur Ventolin", dosage: "Au besoin", duration: "En cours", datePrescribed: "2015-01-01" },
    ],
    alerts: [
      { id: "AL001", type: "Allergie", severity: "Élevée", description: "Allergie au pollen - Saisonnier", dateNoted: "2022-04-01" },
      { id: "AL002", type: "Rappel de médicament", severity: "Moyenne", description: "Suivi de l'utilisation du Ventolin", dateNoted: "2024-07-01" },
    ]
  },
};

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const patient = mockPatientData[patientId];

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <UsersIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Patient non trouvé</h1>
        <p className="text-muted-foreground mb-4">Le dossier patient que vous recherchez n'existe pas ou n'a pas pu être chargé.</p>
        <Link href="/patients" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des patients
          </Button>
        </Link>
      </div>
    );
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const medicalEntryTypeDisplay: Record<MedicalEntry['type'], string> = {
    Consultation: "Consultation",
    Vaccination: "Vaccination",
    Test: "Examen",
    Note: "Note",
    Admission: "Admission",
    Discharge: "Sortie",
  };

  const alertTypeDisplay: Record<PatientAlertType['type'], string> = {
    Allergy: "Allergie",
    "Medication Reminder": "Rappel de médicament",
    "Critical Condition": "Condition critique",
    "Follow-up Required": "Suivi requis",
    Note: "Note",
  };
  
  const alertSeverityDisplay: Record<PatientAlertType['severity'], string> = {
    High: "Élevée",
    Medium: "Moyenne",
    Low: "Faible",
    Info: "Info",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/patients" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux patients
          </Button>
        </Link>
        <Button size="sm">
          <Edit className="mr-2 h-4 w-4" /> Modifier le patient
        </Button>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 dark:bg-primary/20 p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person face" />
              <AvatarFallback className="text-3xl">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="font-headline text-3xl text-primary dark:text-primary-foreground/90">{patient.name}</CardTitle>
              <CardDescription className="text-base text-muted-foreground dark:text-foreground/70">ID Patient: {patient.id}</CardDescription>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80 dark:text-foreground/70">
                <span className="flex items-center"><CalendarIcon className="mr-1.5 h-4 w-4 text-primary" /> Né(e) le: {format(new Date(patient.dateOfBirth), "d MMMM yyyy", {locale: fr})} ({calculateAge(patient.dateOfBirth)} ans)</span>
                <span className="flex items-center"><User className="mr-1.5 h-4 w-4 text-primary" /> Genre: {patient.gender}</span>
              </div>
            </div>
            <div className="md:text-right">
                <Link href={`/consultations/new?patientId=${patient.id}`} passHref>
                    <Button className="w-full md:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle consultation
                    </Button>
                </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
                <h4 className="font-medium text-sm flex items-center"><Mail className="mr-2 h-4 w-4 text-primary/80" />E-mail</h4>
                <p className="text-muted-foreground">{patient.contact}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-medium text-sm flex items-center"><Phone className="mr-2 h-4 w-4 text-primary/80" />Téléphone</h4>
                <p className="text-muted-foreground">{patient.phone}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-medium text-sm flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary/80" />Adresse</h4>
                <p className="text-muted-foreground">{patient.address}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-medium text-sm flex items-center">Contact d'urgence</h4>
                <p className="text-muted-foreground">{patient.emergencyContact?.name} ({patient.emergencyContact?.relationship}) - {patient.emergencyContact?.phone}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-medium text-sm flex items-center">Assurance</h4>
                <p className="text-muted-foreground">{patient.insurance?.provider} - Police: {patient.insurance?.policyNumber}</p>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="history">Antécédents médicaux</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="prescriptions">Ordonnances</TabsTrigger>
          <TabsTrigger value="alerts">Alertes & Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du patient</CardTitle>
              <CardDescription>Informations clés et activité récente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{patient.medicalHistorySummary}</p>
                <Separator />
                <h3 className="font-semibold">Activité récente</h3>
                {patient.medicalHistory.slice(0,2).map(entry => (
                     <div key={entry.id} className="p-3 border rounded-md">
                        <p className="font-medium">{medicalEntryTypeDisplay[entry.type]}: {entry.summary} - <span className="text-sm text-muted-foreground">{format(new Date(entry.date), "PP", {locale: fr})}</span></p>
                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                     </div>
                ))}
                 <div className="mt-6 flex justify-center">
                  <Image src="https://placehold.co/600x300.png" alt="Graphique de santé du patient" data-ai-hint="health data" width={600} height={300} className="rounded-lg object-cover" />
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Antécédents médicaux</CardTitle>
              <CardDescription>Enregistrement chronologique détaillé des événements médicaux.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.medicalHistory.map((entry: MedicalEntry) => (
                <div key={entry.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{medicalEntryTypeDisplay[entry.type]}: {entry.summary}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), "d MMMM yyyy", {locale: fr})} avec {entry.doctor}
                      </p>
                    </div>
                    <Badge variant="outline">{medicalEntryTypeDisplay[entry.type]}</Badge>
                  </div>
                  {entry.details && <p className="mt-2 text-sm text-foreground/80">{entry.details}</p>}
                </div>
              ))}
               {patient.medicalHistory.length === 0 && <p className="text-muted-foreground text-center py-4">Aucun antécédent médical enregistré.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Rendez-vous</CardTitle>
                    <CardDescription>Rendez-vous passés et à venir pour {patient.name}.</CardDescription>
                </div>
                <Link href={`/appointments/new?patientId=${patient.id}`} passHref>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />Planifier (Nouveau)</Button>
                </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.appointments?.map((apt: Appointment) => (
                <div key={apt.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{format(new Date(apt.date), "d MMMM yyyy", {locale: fr})} à {apt.time} - {apt.reason}</p>
                    <p className="text-sm text-muted-foreground">Avec: {apt.doctorName}</p>
                  </div>
                  <Badge variant={apt.status === "Programmé" ? "default" : apt.status === "Terminé" ? "secondary" : "destructive"}>
                    {apt.status}
                  </Badge>
                </div>
              ))}
              {(!patient.appointments || patient.appointments.length === 0) && <p className="text-muted-foreground text-center py-4">Aucun rendez-vous enregistré.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ordonnances</CardTitle>
              <CardDescription>Ordonnances médicamenteuses actuelles et passées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.prescriptions?.map((prescription: Prescription) => (
                <div key={prescription.id} className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{prescription.medication}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Posologie: {prescription.dosage}</p>
                  <p className="text-sm text-muted-foreground">Durée: {prescription.duration}</p>
                  <p className="text-sm text-muted-foreground">Prescrit le: {format(new Date(prescription.datePrescribed), "PP", {locale: fr})}</p>
                </div>
              ))}
              {(!patient.prescriptions || patient.prescriptions.length === 0) && <p className="text-muted-foreground text-center py-4">Aucune ordonnance enregistrée.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes & Notes importantes</CardTitle>
              <CardDescription>Alertes critiques et autres notes importantes pour le patient.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.alerts?.map((alert: PatientAlertType) => (
                <div key={alert.id} className={`p-3 border-l-4 rounded-md ${alert.severity === 'Élevée' ? 'border-destructive bg-destructive/10' : alert.severity === 'Moyenne' ? 'border-yellow-500 bg-yellow-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className={`h-5 w-5 ${alert.severity === 'Élevée' ? 'text-destructive' : alert.severity === 'Moyenne' ? 'text-yellow-600' : 'text-blue-600'}`} />
                    <h4 className="font-semibold">{alertTypeDisplay[alert.type]} <span className="text-xs text-muted-foreground">({alertSeverityDisplay[alert.severity]})</span></h4>
                  </div>
                  <p className="text-sm">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Noté le: {format(new Date(alert.dateNoted), "PP", {locale: fr})}</p>
                </div>
              ))}
              {(!patient.alerts || patient.alerts.length === 0) && <p className="text-muted-foreground text-center py-4">Aucune alerte ou note enregistrée.</p>}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
