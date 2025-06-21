"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="font-headline text-3xl font-bold">Paramètres</h1>
         <div className="w-[88px]"></div> {/* Placeholder for balance */}
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Paramètres de l'application</CardTitle>
          <CardDescription>Gérez vos préférences et les paramètres de l'application.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <SettingsIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground">Page des paramètres bientôt disponible</h2>
          <p className="text-muted-foreground">Cette section vous permettra de configurer divers paramètres de l'application.</p>
          <Link href="/dashboard" passHref className="mt-4">
            <Button variant="outline">Aller au tableau de bord</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
