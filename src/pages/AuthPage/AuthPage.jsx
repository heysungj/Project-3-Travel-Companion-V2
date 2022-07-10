import { useState } from 'react'
import SignUpForm from "../../components/SignUpForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"

export default function AuthPage({ setUser }) {
  const [showSignUpForm, setShowSignUpForm] = useState(false)
  return (
    <main>
      <h1>Auth Page</h1>
      <LoginForm
        setUser={setUser}
        setShowSignUpForm={setShowSignUpForm}
        showSignUpForm={showSignUpForm}
      />
      {(showSignUpForm) ?
        <SignUpForm setUser={setUser} /> :
        null
      }
    </main>
  )
}
