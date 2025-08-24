import { authClient } from "../../../lib/auth-client.ts"
import AuthInput from "../../../src/components/AuthInput"
import { Button } from "../../../app/components/ui/button"
import AuthForm from "../../../src/components/AuthForm"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/signup')({
  component: SignUp,
})

function SignUp() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  if (session) {
    navigate({ to: "/" })
    toast("Already signed in")
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    const data = e.target
    await authClient.signUp.email(
      {
        username: data.username.value,
        password: data.password.value,
        email: data.email.value,
        image: `https://www.gravatar.com/avatar/${data.username.value}?d=identicon&s=200&r=pg`,
      },
      {
        onError: (response) => toast(response.error.message || "Something went wrong"),
      },
    )
  }
  return (
    <AuthForm title="Sign up" onSubmit={onSubmit}>
      <AuthInput
        type="text"
        name="username"
        labelText="Username"
        minLength="3"
      />
      <AuthInput type="text" name="email" labelText="Email" />
      <AuthInput
        type="password"
        name="password"
        labelText="Password"
        minLength="8"
      />
      <Button type="submit">Send</Button>
    </AuthForm>
  )
}