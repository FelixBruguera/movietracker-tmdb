import { authClient } from "@lib/auth-client.ts"
import AuthInput from "./AuthInput.jsx"
import { Button } from "@ui/button.tsx"
import AuthForm from "./AuthForm.jsx"
import { toast } from "sonner"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  if (session) {
    navigate("/")
    toast("Already signed in")
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    const data = e.target
    const imageUuid = crypto.randomUUID().split("-").join("")
    await authClient.signUp.email(
      {
        username: data.username.value,
        password: data.password.value,
        email: data.email.value,
        image: `https://www.gravatar.com/avatar/${imageUuid}?d=identicon&s=200&r=pg`,
      },
      {
        onSuccess: () => {
          navigate("/users/login")
          toast("Succesfully signed up")
        },
        onError: (response) =>
          toast(response.error.message || "Something went wrong"),
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

export default Signup
