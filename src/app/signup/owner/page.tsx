
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
import { signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.email || data.phone, {
    message: "Email or phone number is required.",
    path: ['email'],
});

export default function OwnerSignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);
  const [signupMethod, setSignupMethod] = useState("email");


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const email = signupMethod === 'email' ? values.email : `${values.phone}@bookmyvenue.com`;
       if(!email) throw new Error("Email is required.");

      await signUp(email, values.password, values.name, 'owner', values.phone);
      setShowVerificationInfo(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Owner Sign Up</CardTitle>
            <CardDescription>
              Create an account to start listing your venues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showVerificationInfo ? (
                <Alert>
                    <MailCheck className="h-4 w-4" />
                    <AlertTitle>Account Created!</AlertTitle>
                    <AlertDescription>
                        We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
                    </AlertDescription>
                     <Button asChild className="mt-4 w-full">
                        <Link href="/login/owner">Proceed to Login</Link>
                    </Button>
                </Alert>
            ): (
            <Tabs value={signupMethod} onValueChange={setSignupMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Mobile</TabsTrigger>
                </TabsList>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                    Create Owner Account
                    </Button>
                </form>
                </Form>
            </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start">
            <div className="mt-4 text-center text-sm w-full">
              Already have an owner account?{" "}
              <Link href="/login/owner" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
