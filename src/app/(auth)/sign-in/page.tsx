"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form"; // form validation
import { zodResolver } from "@hookform/resolvers/zod";  // form input tester.Eg, email: should should contain @ and takes schema
import { ZodError, z } from "zod";    // helps creating schema that will be passed in zodResolver.
import { AuthCredentialValidator } from "@/lib/validators/account-credentials-validator"; //created in separate folder using zod to use in client/server
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
const Page = () => {
    const searchParams = useSearchParams()   // for client-rendered file, need to use hook. Check server file(that doesn't have use client at top), we can get it at props.
    const router = useRouter();

    const isSeller = searchParams.get('as') === 'seller'                 // in query it will be as http//localhost://3000/sign-in?as=seller
    const origin = searchParams.get('origin')               // in query it will be as http//localhost://3000/sign-in?origin=http%3A%2F%2Flocalhost%3A3000%2Fproducts

    const continueAsSeller = () => {
        router.push("?as=seller");
    }

    const continueAsBuyer = () => {
        router.replace("/sign-in", undefined);
    }

    type TAuthCredentialsValidator = z.infer<typeof AuthCredentialValidator>;

    const { register, handleSubmit, formState: { errors } } = useForm<TAuthCredentialsValidator>({ resolver: zodResolver(AuthCredentialValidator) });

    // api call form client to server
    const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
      onSuccess: () => {
          toast.success('Signed in successfully');

          if(origin) {      // origin = router history: To send user to the original page they were on before signing in.
            router.push(`/${ origin }`);
            return;
          };

          if(isSeller) {
            router.push('/sell');
            return;
          };

          router.push('/');
          router.refresh();
      },
      onError: (err) => {
          if(err.data?.code === 'UNAUTHORIZED') {
            toast.error('Invalid credentials');
          }
      }
     });

    const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
        signIn({ email, password });
    }

  return (
    <>
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Image src="/DigitalArc.jpg" alt="digital arc sign-up" width="100" height="100" />
                    
                    <h1 className="text-2xl font-bold">Sign in to your { isSeller ? 'seller account' : 'account' }</h1>
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
                            <span className="bg-background px-2 text-muted-foreground">or</span>
                        </div>
                    </div>

                    { isSeller ? (
                        <Button onClick={ continueAsBuyer } variant='secondary' disabled={ isLoading }>Continue as customer</Button>
                    ): (
                        <Button onClick={ continueAsSeller } variant='secondary' disabled={ isLoading }>Continue as Seller</Button>
                    )
                }
                </div>
            </div>
        </div>
    </>
  )
}

export default Page