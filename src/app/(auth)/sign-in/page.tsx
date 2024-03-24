"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"; // form validation
import { zodResolver } from "@hookform/resolvers/zod";  // form input tester.Eg, email: should should contain @ and takes schema
import { ZodError, z } from "zod";    // helps creating schema that will be passed in zodResolver.
import { AuthCredentialValidator } from "@/lib/validators/account-credentials-validator"; //created in separate folder using zod to use in client/server
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"

const Page = () => {
    const searchParams = useSearchParams()   // for client-rendered file, need to use hook. Check server file(that doesn't have use client at top), we can get it at props.
    const router = useRouter();

    const isSeller = searchParams.get('as')                 // in query it will be as http//localhost://3000/sign-in?as=seller
    const origin = searchParams.get('origin')               // in query it will be as http//localhost://3000/sign-in?origin=http%3A%2F%2Flocalhost%3A3000%2Fproducts

    type TAuthCredentialsValidator = z.infer<typeof AuthCredentialValidator>;

    const { register, handleSubmit, formState: { errors } } = useForm<TAuthCredentialsValidator>({ resolver: zodResolver(AuthCredentialValidator) });


    //api call form client to server
    const { mutate, isLoading } = trpc.auth.signIn.useMutation({ 
        onError: (err) => {
            if(err.data?.code === "CONFLICT") {
                toast.error("This email is already in use. Sign In Instead?");
                return;
            }

            if(err instanceof ZodError) {
                toast.error(err.issues[0].message);
                return;
            }

            toast.error("Something went wrong. Please try again later.");
        },
        onSuccess: ({ sentToEmail }) => {
            toast.success(`Verification email sent to ${ sentToEmail }`);
            router.push(`/verify-email?to=${ sentToEmail }`);
        }
     });

    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        //send data to server
        mutate({ email, password });
    }

  return (
    <>
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Image src="/DigitalBazaar.png" alt="digital bazaar sign-up" width="100" height="100" />
                    <h1 className="text-2xl font-bold">Sign in to your account</h1>
                    <Link href="/sign-up" className={ buttonVariants({ variant:'link',className:'gap-1.5' }) }>Don&apos;t have an account? <ArrowRight /> </Link>
                 </div>
                 
                <div className="grid gap-6">
                     <form onSubmit={ handleSubmit(onSubmit) }>
                        <div className="grid gap-2">
                            <div className="grid gap-1 py-2">
                                <Label htmlFor="email">Email</Label>
                                <Input { ...register('email') } type="email" className={ cn({ "focus-visible:ring-red-500": errors.email }) } placeholder="Enter your email"/>

                                { errors?.email && <p className="text-sm text-red-500">{ errors.email.message }</p> }
                            </div>

                            <div className="grid gap-1 py-2">
                                <Label htmlFor="password">Password</Label>
                                <Input { ...register('password')  } type="password" className={ cn({ "focus-visible:ring-red-500": errors.password }) } placeholder="Password"/>
                           
                                { errors?.password && <p className="text-sm text-red-500">{ errors.password.message }</p> }
                            </div>

                            <Button>Sign In</Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Page