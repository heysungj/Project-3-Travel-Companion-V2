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
                    <form autoComplete="off" onSubmit={this.handleSubmit}>
                        <label className='signUpFormLabel'>Name</label>
                        <input className='signUpFormInput' type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Mr. Travels"required />
                        
                        <label className='signUpFormLabel'>Email</label>
                        <input className='signUpFormInput' type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="john@email.com"required />
                        
                        <label className='signUpFormLabel'>Password</label>
                        <input className='signUpFormInput' type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="set password"required />
                        
                        <label className='signUpFormLabel'>Confirm</label>
                        <input className='signUpFormInput' type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} placeholder="confirm password"required />
                        <button className ="submit" type="submit" disabled={disable}>SIGN UP</button>
                    </form>
                </div>
                <p className="error-message">&nbsp;{this.state.error}</p>
            </div>
        );
    }
}