
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { User, KeyRound } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-md">
           <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Login</CardTitle>
            <CardDescription>
              Are you a customer or a venue owner?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <Link href="/login/customer" passHref>
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <User className="h-8 w-8 text-primary" />
                <span className="text-lg">I'm a Customer</span>
              </Button>
            </Link>
             <Link href="/login/owner" passHref>
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <KeyRound className="h-8 w-8 text-primary" />
                <span className="text-lg">I'm a Venue Owner</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
