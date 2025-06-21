
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePatientAction } from './actions';
import { PatientFormSchema, type PatientFormData } from './schema'; // Import from schema.ts
import { Separator } from "@/components/ui/separator";

const genderOptions: PatientFormData['gender'][] = ['Masculin', 'Féminin', 'Autre'];
const statusOptions: PatientFormData['status'][] = ['Actif', 'Inactif', 'En attente'];

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: undefined, // Laisser vide pour que le placeholder s'affiche
      contact: "",
      phone: "",
      address: "",
      medicalHistorySummary: "",
      status: "Actif", // Default status
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
    }
  });

  const onSubmit = async (data: PatientFormData) => {
    const result = await savePatientAction(data);

    if (result.success) {
      toast({
        title: "Patient enregistré",
        description: result.message,
        variant: "default",
      });
      router.push(`/patients/${result.patientId}`); // Redirect to new patient's detail page
    } else {
      let errorMsg = result.message;
      // Les erreurs par champ sont déjà gérées par react-hook-form
      toast({
        title: "Erreur d'enregistrement",
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
        <h1 className="font-headline text-3xl font-bold">Ajouter un nouveau patient</h1>
        <div className="w-[88px]"></div> {/* Placeholder for balance */}
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Formulaire d'enregistrement de patient</CardTitle>
          <CardDescription>Entrez les informations du nouveau patient.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <h3 className="text-lg font-medium text-primary">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" {...register("name")} placeholder="ex: Jean Dupont" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Genre</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Sélectionner le genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">Statut du patient</Label>
                 <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>
            </div>

            <h3 className="text-lg font-medium text-primary pt-4">Coordonnées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contact">Adresse e-mail</Label>
                <Input id="contact" type="email" {...register("contact")} placeholder="ex: jean.dupont@email.com" />
                {errors.contact && <p className="text-sm text-destructive mt-1">{errors.contact.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone (optionnel)</Label>
                <Input id="phone" type="tel" {...register("phone")} placeholder="ex: 0612345678" />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="address">Adresse postale</Label>
              <Textarea id="address" {...register("address")} placeholder="ex: 123 Rue de la Paix, 75000 Paris" rows={3}/>
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            
            <Separator className="my-6" />
            <h3 className="text-lg font-medium text-primary">Informations médicales</h3>
             <div>
                <Label htmlFor="medicalHistorySummary">Résumé des antécédents médicaux (optionnel)</Label>
                <Textarea id="medicalHistorySummary" {...register("medicalHistorySummary")} placeholder="ex: Allergies connues, conditions chroniques..." rows={4} />
                {errors.medicalHistorySummary && <p className="text-sm text-destructive mt-1">{errors.medicalHistorySummary.message}</p>}
              </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium text-primary">Contact d'urgence (optionnel)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="emergencyContactName">Nom du contact</Label>
                <Input id="emergencyContactName" {...register("emergencyContactName")} />
                {errors.emergencyContactName && <p className="text-sm text-destructive mt-1">{errors.emergencyContactName.message}</p>}
              </div>
              <div>
                <Label htmlFor="emergencyContactRelationship">Relation</Label>
                <Input id="emergencyContactRelationship" {...register("emergencyContactRelationship")} placeholder="ex: Conjoint(e), Parent..." />
                {errors.emergencyContactRelationship && <p className="text-sm text-destructive mt-1">{errors.emergencyContactRelationship.message}</p>}
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Téléphone du contact</Label>
                <Input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone")} />
                {errors.emergencyContactPhone && <p className="text-sm text-destructive mt-1">{errors.emergencyContactPhone.message}</p>}
              </div>
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium text-primary">Informations d'assurance (optionnel)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="insuranceProvider">Nom de l'assureur</Label>
                <Input id="insuranceProvider" {...register("insuranceProvider")} />
                {errors.insuranceProvider && <p className="text-sm text-destructive mt-1">{errors.insuranceProvider.message}</p>}
              </div>
              <div>
                <Label htmlFor="insurancePolicyNumber">Numéro de police</Label>
                <Input id="insurancePolicyNumber" {...register("insurancePolicyNumber")} />
                {errors.insurancePolicyNumber && <p className="text-sm text-destructive mt-1">{errors.insurancePolicyNumber.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
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
                    Enregistrement...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" /> Enregistrer le patient
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
