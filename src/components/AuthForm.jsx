const AuthForm = (props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 my-5 2xl:pt-30">
      <h2 className="font-bold text-xl">{props.title}</h2>
      <form
        onSubmit={(e) => props.onSubmit(e)}
        className="flex flex-col w-3/4 lg:w-1/4 max-w-100 m-auto gap-3"
      >
        {props.children}
      </form>
    </div>
  )
}

export default AuthForm
