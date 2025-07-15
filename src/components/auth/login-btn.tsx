"use client"

import { signIn } from "@/lib/auth-client"
import { Button } from "../ui/button"

const LoginButton = () => {

  const handleLogin=async()=>{
    await signIn.social({
      provider: 'google',
      callbackURL : '/'
    })
  }

  return (
    <div>
        <Button onClick={handleLogin} className="w-full font-medium">
        <span>Sing in with Google</span>
        </Button>
    </div>
  )
}

export default LoginButton