import React, { Component } from 'react';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      success: false
    };
  }

  handleChange = name => e =>
    this.setState({ [name]: e.target.value, error: '' });

  clickSubmit = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const user = { name, email, password };
    signup(user).then(res => {
      if (res.err) this.setState({ error: res.err });
      else {
        this.setState({
          name: '',
          email: '',
          password: '',
          error: '',
          success: true
        });
      }
    });
  };

  signUpForm = (name, email, password) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={this.handleChange('name')}
          value={name}
          type='text'
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={this.handleChange('email')}
          value={email}
          type='email'
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          onChange={this.handleChange('password')}
          value={password}
          type='password'
          className='form-control'
        />
      </div>
      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Submit
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, success } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Sign up</h2>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        <div
          className='alert alert-success'
          style={{ display: success ? '' : 'none' }}
        >
          New acount is successfully created. Pls{' '}
          <Link to='/signin'>Signin</Link>!!!
        </div>

        {this.signUpForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
