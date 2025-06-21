"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, Users, CalendarClock, Activity, BriefcaseMedical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const healthMetrics = [
  { title: "Patients actifs", value: "125", change: "+5 cette semaine", icon: <Users className="h-6 w-6 text-primary" />, trend: "up" },
  { title: "Rendez-vous à venir", value: "18", change: "+3 aujourd'hui", icon: <CalendarClock className="h-6 w-6 text-accent" />, trend: "up" },
  { title: "Temps moy. de consultation", value: "22 min", change: "-2 min le mois dernier", icon: <Activity className="h-6 w-6 text-destructive" />, trend: "down" },
  { title: "Consultations terminées", value: "350", change: "ce mois-ci", icon: <BriefcaseMedical className="h-6 w-6 text-green-500" />, trend: "stable" },
];

const upcomingAppointments = [
  { id: "APT001", patientName: "Alice Wonderland", time: "10:00", doctor: "Dr. Smith", reason: "Suivi" },
  { id: "APT002", patientName: "Bob The Builder", time: "11:30", doctor: "Dr. Jones", reason: "Nouveau problème" },
  { id: "APT003", patientName: "Charlie Brown", time: "14:15", doctor: "Dr. Smith", reason: "Bilan de routine" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Bienvenue, Dr Agent !</h1>
          <p className="text-muted-foreground">Voici votre aperçu de la gestion de la santé pour aujourd'hui.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/appointments/new" passHref>
                 <Button>Nouveau rendez-vous</Button>
            </Link>
            <Link href="/patients/new" passHref>
                <Button variant="outline">Ajouter un patient</Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {healthMetrics.map((metric) => (
          <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metric.trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />}
                {metric.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />}
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Rendez-vous à venir</CardTitle>
            <CardDescription>Vos rendez-vous programmés pour aujourd'hui.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.patientName}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell className="text-muted-foreground">{apt.reason}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/appointments/${apt.id}`} passHref>
                        <Button variant="outline" size="sm">Détails</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarClock className="mx-auto h-12 w-12 mb-2" />
                Aucun rendez-vous à venir pour aujourd'hui.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Progression de l'intégration des patients</CardTitle>
            <CardDescription>Suivre l'enregistrement des nouveaux patients et la configuration initiale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Nouvelles inscriptions</span>
                <span className="text-sm text-muted-foreground">25 / 50 Objectif</span>
              </div>
              <Progress value={50} aria-label="Nouvelles inscriptions de patients" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Consultations initiales effectuées</span>
                <span className="text-sm text-muted-foreground">15 / 25 En attente</span>
              </div>
              <Progress value={60} aria-label="Consultations initiales effectuées" className="[&>div]:bg-accent" />
            </div>
             <div className="mt-6 flex justify-center">
              <Image src="https://placehold.co/600x300.png" alt="Illustration de l'intégration des patients" data-ai-hint="health chart" width={600} height={300} className="rounded-lg object-cover" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
