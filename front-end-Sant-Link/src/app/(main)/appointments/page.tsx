"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, CalendarDays, MoreHorizontal, Edit, XCircle } from "lucide-react";
import Link from "next/link";
import type { Appointment } from "@/types";
import { format, parseISO, isSameDay, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const mockAppointments: Appointment[] = [
  { id: "APT001", patientId: "PAT001", patientName: "Alice Wonderland", doctorId: "DOC001", doctorName: "Dr. Smith", date: "2024-07-29", time: "10:00", reason: "Suivi", status: "Programmé" },
  { id: "APT002", patientId: "PAT002", patientName: "Robert Smith", doctorId: "DOC002", doctorName: "Dr. Jones", date: "2024-07-29", time: "11:30", reason: "Nouveau problème", status: "Programmé" },
  { id: "APT003", patientId: "PAT003", patientName: "Charles Xavier", doctorId: "DOC001", doctorName: "Dr. Smith", date: "2024-07-30", time: "14:15", reason: "Bilan de routine", status: "Programmé" },
  { id: "APT004", patientId: "PAT004", patientName: "Diana Prince", doctorId: "DOC003", doctorName: "Dr. Strange", date: "2024-08-01", time: "09:00", reason: "Consultation", status: "Terminé" },
  { id: "APT005", patientId: "PAT001", patientName: "Alice Wonderland", doctorId: "DOC001", doctorName: "Dr. Smith", date: "2024-08-05", time: "15:00", reason: "Revue de médication", status: "Annulé" },
];

const doctors = [
  { id: "DOC001", name: "Dr. Smith" },
  { id: "DOC002", name: "Dr. Jones" },
  { id: "DOC003", name: "Dr. Strange" },
];

const appointmentStatuses = ["Programmé", "Terminé", "Annulé"];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(apt => {
      const appointmentDate = parseISO(apt.date);
      const matchesDate = selectedDate ? isSameDay(appointmentDate, selectedDate) : true;
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDoctor = doctorFilter === "all" || apt.doctorId === doctorFilter;
      const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
      return matchesDate && matchesSearch && matchesDoctor && matchesStatus;
    });
  }, [selectedDate, searchTerm, doctorFilter, statusFilter]);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, number>();
    mockAppointments.forEach(apt => {
        const dateStr = format(parseISO(apt.date), "yyyy-MM-dd");
        map.set(dateStr, (map.get(dateStr) || 0) + 1);
    });
    return map;
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Gestion des rendez-vous</h1>
          <p className="text-muted-foreground">Planifiez, visualisez et gérez les rendez-vous des patients.</p>
        </div>
        <Link href="/appointments/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Nouveau rendez-vous
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/> Sélectionner une date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              locale={fr}
              modifiers={{
                hasAppointments: (date) => appointmentsByDay.has(format(date, "yyyy-MM-dd"))
              }}
              modifiersClassNames={{
                hasAppointments: "bg-primary/20 text-primary rounded-full",
              }}
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const count = appointmentsByDay.get(formattedDate);
                  if (count && date.getMonth() === displayMonth.getMonth()) {
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {format(date, "d", { locale: fr })}
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs leading-none rounded-full">
                          {count}
                        </Badge>
                      </div>
                    );
                  }
                  return format(date, "d", { locale: fr });
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>
              Rendez-vous du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "toutes les dates"}
            </CardTitle>
            <CardDescription>Gérer les rendez-vous en fonction des filtres.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par patient ou motif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Rechercher des rendez-vous"
                />
              </div>
              <div className="flex gap-2 sm:gap-4">
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrer par médecin">
                    <SelectValue placeholder="Filtrer par médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les médecins</SelectItem>
                    {doctors.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrer par statut">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {appointmentStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heure</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.time}</TableCell>
                      <TableCell>
                        <Link href={`/patients/${apt.patientId}`} className="hover:underline text-primary">
                            {apt.patientName}
                        </Link>
                      </TableCell>
                      <TableCell>{apt.doctorName}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={apt.reason}>{apt.reason}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            apt.status === "Programmé" ? "default" : 
                            apt.status === "Terminé" ? "secondary" : 
                            "destructive"
                          }
                           className={
                            apt.status === "Programmé" ? "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" :
                            apt.status === "Terminé" ? "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                            "bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                          }
                        >
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                              <span className="sr-only">Actions du rendez-vous</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Replanifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                              <XCircle className="mr-2 h-4 w-4" /> Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Aucun rendez-vous trouvé pour les critères sélectionnés.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
