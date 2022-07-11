import { useState, useEffect } from "react";
import * as usersService from "../../utilities/users-service";
import jwt_decode from "jwt-decode";
import "./LoginForm.css"

export default function LoginForm({
  setUser,
  setShowSignUpForm,
  showSignUpForm,
}) {
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

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
      <div className="form-container" onSubmit={handleSubmit}>
        <h3>Log In</h3>
        <form autoComplete="off">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="email@email.com"
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Password"
          />
          <br />
          <div className="form-btn">
            <button className="searchBtn" type="submit">Sign In</button>
          </div>
        </form>

        <p className="error-message">&nbsp;{error}</p>
        <div className="loginBtn-container">
        <h5>Sign In or Sign Up with Gmail</h5>
        <div id="signInDiv"></div>
      </div>
      </div>
  );
}
