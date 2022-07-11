import SignUpForm from "../../components/SignUpForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"
import "./AuthPage.css"
import { useState } from "react"

export default function AuthPage({ setUser }) {
  const [showSignUpForm, setShowSignUpForm] = useState(false)

  return (
    <main className='auth-main'>
      <h2 className="logInLogo">Travel Companions</h2>
      <h2 className="logInBlue"> Sign in or create an account.</h2>
      <div>
      {(showSignUpForm) ?
      <LoginForm
        setUser={setUser}
        setShowSignUpForm={setShowSignUpForm}
        showSignUpForm={showSignUpForm}
      />
      :
        <SignUpForm setUser={setUser} /> 
        }
        </div>
        <div className="loginBtn-container2">
        <button className="searchBtn" onClick={() => setShowSignUpForm(!showSignUpForm)}>
          Not Registered? Sign Up
        </button>
      </div>
    </main>
  )
}
