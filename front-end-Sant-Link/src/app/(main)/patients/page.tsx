"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, MoreHorizontal, FilePenLine, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import type { Patient } from "@/types"; 
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


const mockPatients: Patient[] = [
  { id: "PAT001", name: "Alice Wonderland", dateOfBirth: "1990-05-15", gender: "Féminin", contact: "alice@example.com", address: "123 Fantasy Lane", medicalHistorySummary: "Allergies : Pollen", status: "Actif", medicalHistory: [], appointments: [], prescriptions: [], alerts: [] },
  { id: "PAT002", name: "Robert Smith", dateOfBirth: "1985-11-22", gender: "Masculin", contact: "bob@example.com", address: "456 Reality Road", medicalHistorySummary: "Pathologie : Hypertension", status: "Actif", medicalHistory: [], appointments: [], prescriptions: [], alerts: [] },
  { id: "PAT003", name: "Charles Xavier", dateOfBirth: "1972-02-10", gender: "Masculin", contact: "charlie@example.com", address: "789 Mutant Drive", medicalHistorySummary: "Aucun", status: "Inactif", medicalHistory: [], appointments: [], prescriptions: [], alerts: [] },
  { id: "PAT004", name: "Diana Prince", dateOfBirth: "1988-07-01", gender: "Féminin", contact: "diana@example.com", address: "101 Amazon Trail", medicalHistorySummary: "Pathologie : Asthme", status: "Actif", medicalHistory: [], appointments: [], prescriptions: [], alerts: [] },
  { id: "PAT005", name: "Edward Nygma", dateOfBirth: "1995-03-20", gender: "Masculin", contact: "edward@example.com", address: "202 Riddle Ave", medicalHistorySummary: "Allergies : Arachides", status: "En attente", medicalHistory: [], appointments: [], prescriptions: [], alerts: [] },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({ Actif: true, Inactif: false, "En attente": false });

  const filteredPatients = useMemo(() => {
    const activeStatuses = Object.entries(statusFilter)
      .filter(([, isActive]) => isActive)
      .map(([status]) => status);
    
    return mockPatients.filter(patient =>
      (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeStatuses.length === 0 || activeStatuses.includes(patient.status))
    );
  }, [searchTerm, statusFilter]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(prev => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dossiers des patients</h1>
          <p className="text-muted-foreground">Gérer et consulter les informations des patients.</p>
        </div>
        <Link href="/patients/new" passHref>
            <Button>
                <PlusCircle className="mr-2 h-5 w-5" />
                Ajouter un nouveau patient
            </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des patients par nom ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                aria-label="Rechercher des patients"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filtrer par statut</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusFilter).map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter[status]}
                    onCheckedChange={() => handleStatusChange(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Patient</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{format(new Date(patient.dateOfBirth), "dd/MM/yyyy", {locale: fr})}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          patient.status === "Actif" ? "default" : 
                          patient.status === "Inactif" ? "secondary" : 
                          "outline" 
                        }
                        className={
                          patient.status === "Actif" ? "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                          patient.status === "Inactif" ? "bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                          "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions du patient</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Voir les détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FilePenLine className="mr-2 h-4 w-4" /> Modifier le dossier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer le patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Aucun patient trouvé correspondant à vos critères.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
