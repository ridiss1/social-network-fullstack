import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate } from '../auth';

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirect: false,
      loading: false
    };
  }

  handleChange = name => e => this.setState({ [name]: e.target.value });

  clickSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };
    this.setState({ loading: true });
    signin(user).then(res => {
      if (res.err) this.setState({ error: res.err, loading: false });
      else {
        //authenticate
        //redirect
        authenticate(res, () => {
          this.setState({ redirect: true, loading: false });
        });
      }
    });
  };

  signInForm = (email, password) => (
    <form>
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
        Sign in
      </button>
    </form>
  );

  render() {
    const { loading, email, password, error, redirect } = this.state;
    if (redirect) return <Redirect to='/' />;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Sign In</h2>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}

        {this.signInForm(email, password)}
      </div>
    );
  }
}

export default Signin;
