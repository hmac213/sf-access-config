'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const [redirectUri, setRedirectUri] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const uri = searchParams.get('redirect_uri');
    const error = searchParams.get('error');
    if (uri) {
      setRedirectUri(uri);
    }
    if (error) {
      setLoginError(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#0D0D0D] text-white">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-4 text-center text-sm text-red-500">
              Login failed: {loginError}
            </div>
          )}
          <form action={'/api/login'} method="POST">
            {redirectUri && (
              <input type="hidden" name="redirect_uri" value={redirectUri} />
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
