import { Button } from "../../app/components/ui/button.tsx"
import AuthInput from "./AuthInput.jsx"
import { authClient } from "../../lib/auth-client.ts"
import { toast } from "sonner"
import AuthForm from "./AuthForm.jsx"
import { Link } from "react-router"
import { useNavigate } from "react-router"

const Login = () => {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  if (session) {
    navigate("/")
    toast("Already signed in")
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    await authClient.signIn.username(
      {
        username: e.target.user.value,
        password: e.target.password.value,
      },
      {
        onRequest: () => toast("Signing you in..."),
        onError: (response) =>
          toast(response.error.message || "Something went wrong"),
      },
    )
  }

  return (
    <AuthForm title="Login" onSubmit={onSubmit}>
      <AuthInput
        type="text"
        name="user"
        id="username"
        labelText="Username"
        minLength="3"
      />
      <AuthInput
        type="password"
        name="password"
        id="password"
        labelText="Password"
        minLength="8"
      />
      <div className="flex items-center justify-evenly">
        <Button type="submit">Send</Button>
        <Button asChild>
          <Link to="/users/signup">Sign up</Link>
        </Button>
      </div>
    </AuthForm>
  )
}

export default Login
