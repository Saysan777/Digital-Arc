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
import { z } from "zod";    // helps creating schema that will be passed in zodResolver.
import { AuthCredentialValidator } from "@/lib/validators/account-credentials-validator"; //created in separate folder using zod to use in client/server
import { trpc } from "@/trpc/client";

const Page = () => {
    type TAuthCredentialsValidator = z.infer<typeof AuthCredentialValidator>;

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(AuthCredentialValidator) });

    //api call form client to server
    const { data } = trpc.TestingProcedure.useQuery();

    console.log('data---------', data)

    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        //send data to server
    }
  return (
    <>
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Image src="/DigitalBazaar.png" alt="digital bazaar sign-up" width="100" height="100" />
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <Link href="/sign-in" className={ buttonVariants({ variant:'link',className:'gap-1.5' }) }>Already have an account? <ArrowRight /> </Link>
                 </div>
                 
                <div className="grid gap-6">
                     <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <div className="grid gap-1 py-2">
                                <Label htmlFor="email">Email</Label>
                                <Input { ...register('email') } className={ cn({ "focus-visible:ring-red-500": errors.email }) } placeholder="Enter your email"/>
                            </div>

                            <div className="grid gap-1 py-2">
                                <Label htmlFor="password">Password</Label>
                                <Input { ...register('password')  } className={ cn({ "focus-visible:ring-red-500": errors.password }) } placeholder="Password"/>
                            </div>

                            <Button>Sign Up</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Page