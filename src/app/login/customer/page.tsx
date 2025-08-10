
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { signIn, resendVerificationEmail } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from 'lucide-react';


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function CustomerLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setShowVerificationAlert(false);
    try {
      const userCredential = await signIn(values.email, values.password);
      if (!userCredential.user.emailVerified) {
          await auth.signOut();
          setShowVerificationAlert(true);
          setLoading(false);
          return;
      }

      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (!showVerificationAlert) setLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
      setLoading(true);
      try {
          // Temporarily sign in to get user object, then sign out
          const userCredential = await signIn(form.getValues("email"), form.getValues("password"));
          if (userCredential.user) {
              await sendEmailVerification(userCredential.user);
              toast({
                  title: "Email Sent!",
                  description: "A new verification email has been sent. Please check your inbox.",
              });
          }
          await auth.signOut(); // Ensure user is signed out after sending
      } catch (error: any) {
          toast({
              title: "Error",
              description: "Failed to resend verification email. Please check your credentials.",
              variant: "destructive"
          });
      } finally {
          setLoading(false);
      }
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Customer Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showVerificationAlert ? (
                 <Alert>
                    <MailCheck className="h-4 w-4" />
                    <AlertTitle>Verify Your Email</AlertTitle>
                    <AlertDescription>
                        Please check your inbox to verify your email address. You cannot log in until your email is verified.
                    </AlertDescription>
                     <Button 
                        className="mt-4 w-full" 
                        onClick={handleResendVerification}
                        disabled={loading}
                    >
                         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Resend Verification Email
                    </Button>
                </Alert>
            ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                    </Button>
                </form>
                </Form>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <div className="mt-4 text-center text-sm w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup/customer" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
