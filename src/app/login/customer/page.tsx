
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.email || data.phone, {
    message: "Email or phone number is required.",
    path: ['email'],
});

export default function CustomerLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setShowVerificationAlert(false);

    const identifier = loginMethod === 'email' ? values.email : values.phone;
    if (!identifier) {
        toast({ title: "Error", description: "Please provide an email or phone number.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      // Note: Firebase doesn't directly support login with phone number + password.
      // This implementation assumes you'd look up the user by phone to get their email, then sign in.
      // For a real app, phone auth would use OTP. This is a simplified example.
      const userCredential = await signIn(identifier, values.password);

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
          const identifier = loginMethod === 'email' ? form.getValues("email") : form.getValues("phone");
          if (!identifier) return;
          // Temporarily sign in to get user object, then sign out
          const userCredential = await signIn(identifier, form.getValues("password"));
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
              Enter your credentials below to login to your account.
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
                <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="phone">Mobile</TabsTrigger>
                    </TabsList>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <TabsContent value="email" className="space-y-4 m-0">
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
                        </TabsContent>
                         <TabsContent value="phone" className="space-y-4 m-0">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="9876543210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </TabsContent>
                       
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
                </Tabs>
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
