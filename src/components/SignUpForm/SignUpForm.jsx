import './SignUpForm'
import { Component } from 'react'
import { signUp } from '../../utilities/users-service'
import "./SignUpForm.css"

export default class SignUpForm extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        error: ''
    };

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
            error: ''
        });
    };

    handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            // We don't want to send the 'error' or 'confirm' property,
            //  so let's make a copy of the state object, then delete them
            // const formData = {...this.state}
            // delete formData.error
            // delete formData.confirm
            const { name, email, password } = this.state;
            const formData = { name, email, password };
            // The promise returned by the signUp service method 
            // will resolve to the user object included in the
            // payload of the JSON Web Token (JWT)
            const user = await signUp(formData);
            this.props.setUser(user)
        } catch {
            this.setState({ error: 'Sign-up Failed - Please Try Again' })
        }
    }

    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
            <div>
                <div className="form-container">
                    <h3>Sign Up</h3>
                    <form autoComplete="off" onSubmit={this.handleSubmit}>
                        <label>Name</label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Your Name" required />
                        <label>Email</label>
                        <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="email@email.com" required />
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Set Password" required />
                        <label>Confirm</label>
                        <input type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} placeholder="Confirm Password" required />
                        <p className="error-message">&nbsp;{this.state.error}</p>
                        <div className='loginBtn-container2'>
                <button className="searchBtn" type="submit" disabled={disable}>SIGN UP</button>
                </div>
                    </form>
                </div>
            </div>
        );
    }
}