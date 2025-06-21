
"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveConsultationAction, type ConsultationFormData } from './actions';

const doctors = [
  { id: "DOC001", name: "Dr. Smith" },
  { id: "DOC002", name: "Dr. Jones" },
  { id: "DOC003", name: "Dr. Strange" },
];

// Mock patient lookup
const getPatientNameById = (id: string | null) => {
  if (id === "PAT001") return "Alice Wonderland";
  if (id === "PAT002") return "Robert Smith";
  return id ? `Patient ${id}` : "Patient inconnu";
};

export default function NewConsultationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { toast } = useToast();

  const [consultationDate, setConsultationDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorId, setDoctorId] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
      // Note: La gestion des pièces jointes n'est pas implémentée dans cette version de l'action serveur.
      // Pour une implémentation complète, il faudrait utiliser FormData.
      toast({
        title: "Information",
        description: "La téléversement de fichiers n'est pas encore fonctionnel avec cette action serveur.",
        variant: "default"
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormErrors({}); // Reset errors

    const consultationData: ConsultationFormData = {
      patientId: patientId,
      consultationDate,
      doctorId,
      reason,
      symptoms,
      diagnosis,
      treatmentPlan,
      notes,
    };

    const result = await saveConsultationAction(consultationData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Consultation enregistrée",
        description: result.message,
        variant: "default",
      });
      if (patientId) {
        router.push(`/patients/${patientId}?tab=history`);
      } else {
        router.push("/consultations/history"); // Ou /dashboard si plus approprié
      }
    } else {
      let errorMsg = result.message;
      if (result.errors) {
        const newErrors: Record<string, string | undefined> = {};
        result.errors.forEach(err => {
          if (err.path && err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(newErrors);
        // Optionnel: message toast plus générique si les erreurs sont affichées par champ
        // errorMsg = "Veuillez corriger les erreurs dans le formulaire.";
      }
      toast({
        title: "Erreur d'enregistrement",
        description: errorMsg, // Peut devenir plus spécifique si vous le souhaitez
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
        <h1 className="font-headline text-3xl font-bold">Nouveau dossier de consultation</h1>
        <div className="w-[88px]"></div> {/* Placeholder for balance */}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Détails de la consultation pour {getPatientNameById(patientId)}</CardTitle>
          <CardDescription>Remplissez les détails de cette consultation médicale.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="consultationDate">Date de consultation</Label>
                <Input
                  id="consultationDate"
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  required
                />
                {formErrors.consultationDate && <p className="text-sm text-destructive mt-1">{formErrors.consultationDate}</p>}
              </div>
              <div>
                <Label htmlFor="doctorId">Médecin consultant</Label>
                <Select value={doctorId} onValueChange={setDoctorId} required>
                  <SelectTrigger id="doctorId">
                    <SelectValue placeholder="Sélectionner un médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.doctorId && <p className="text-sm text-destructive mt-1">{formErrors.doctorId}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Motif de la visite</Label>
              <Input
                id="reason"
                placeholder="ex: Bilan annuel, plainte spécifique"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              {formErrors.reason && <p className="text-sm text-destructive mt-1">{formErrors.reason}</p>}
            </div>

            <div>
              <Label htmlFor="symptoms">Symptômes / Plainte principale</Label>
              <Textarea
                id="symptoms"
                placeholder="Décrire les symptômes du patient..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
              />
              {formErrors.symptoms && <p className="text-sm text-destructive mt-1">{formErrors.symptoms}</p>}
            </div>

            <div>
              <Label htmlFor="diagnosis">Diagnostic</Label>
              <Textarea
                id="diagnosis"
                placeholder="Entrer les détails du diagnostic..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
                required
              />
              {formErrors.diagnosis && <p className="text-sm text-destructive mt-1">{formErrors.diagnosis}</p>}
            </div>

            <div>
              <Label htmlFor="treatmentPlan">Plan de traitement / Ordonnances</Label>
              <Textarea
                id="treatmentPlan"
                placeholder="Décrire le plan de traitement, les médicaments prescrits, etc."
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                rows={4}
              />
              {formErrors.treatmentPlan && <p className="text-sm text-destructive mt-1">{formErrors.treatmentPlan}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notes supplémentaires</Label>
              <Textarea
                id="notes"
                placeholder="Toutes autres notes ou observations pertinentes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              {formErrors.notes && <p className="text-sm text-destructive mt-1">{formErrors.notes}</p>}
            </div>

            <div>
              <Label htmlFor="attachments">Pièces jointes (Résultats de laboratoire, Scans, etc.)</Label>
              <div className="flex items-center gap-4">
                <Input id="attachments" type="file" multiple onChange={handleFileChange} className="flex-1" />
                <Button type="button" variant="outline" size="icon" aria-label="Enregistrer une note audio">
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              {attachments.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                  {attachments.map(file => <li key={file.name}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>)}
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-1">Le téléversement de fichiers n'est pas géré dans cette version.</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" /> Enregistrer la consultation
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
