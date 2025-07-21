"use client"

import { signIn } from "@/lib/auth-client"
import { Button } from "../ui/button"

const LoginButton = () => {

  const handleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/'
    })
  }

  return (
    <div className="">
      <Button  onClick={handleLogin} className="w-full font-medium flex items-center justify-center gap-3 cursor-pointer">
        <span>Sign in with</span>
        <img src="/google.png" alt="Google" className="h-5 w-5" />
        <span>Google</span>
      </Button>
    </div>
  )
}

export default LoginButton