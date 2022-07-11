import { useState } from 'react'
import SignUpForm from "../../components/SignUpForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"
import "./AuthPage.css"



export default function AuthPage({ setUser }) {
  const [showSignUpForm, setShowSignUpForm] = useState(false)
  return (
    <main>
      <h2 className="pageLogo">Travel Companions</h2>
      <h2 className="prompt"> Sign in or create an account.</h2>
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
