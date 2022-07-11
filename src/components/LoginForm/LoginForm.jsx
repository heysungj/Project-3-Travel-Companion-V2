import { useState, useEffect } from "react";
import * as usersService from "../../utilities/users-service";
import jwt_decode from "jwt-decode";
import "./LoginForm.css"

export default function LoginForm({
  setUser,
  setShowSignUpForm,
  showSignUpForm,
}) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  // google login response
  async function handleCallbackResponse(response) {
    console.log("Encoded jwt ID token", response.credential);
    let userObject = jwt_decode(response.credential);

    const user = await usersService.registerGoogleUser(
      userObject.name,
      userObject.email
    );
    setUser(user);
  }

  useEffect(() => {
    // initialize google login
    /*global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError("");
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError("Log In Failed - Try Again");
    }
  }

  return (
    <div>
      <div className="form-container" onSubmit={handleSubmit}>
        <form autoComplete="off">
        <label className="loginFormLabels">Email</label>
          <input className="loginFormInputs"
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="john@email.com"
          />
          <label className="loginFormLabels">Password</label>
          <input className="loginFormInputs"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="enter password"
          />
          <button className="submit" type="submit">Sign in with Email</button>
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
      <button className="notReg" onClick={() => setShowSignUpForm(!showSignUpForm)}>
        Not Registered? Sign Up
      </button>

      <div id="signInDiv"></div>
    </div>
  );
}
