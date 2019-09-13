import React, { Component } from 'react';
import { getUser, update, updateLocalStorage } from './apiUser';
import { isAuthenticate } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultAvatar from '../images/avatar.png';

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      email: '',
      name: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0
    };
  }

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    const token = isAuthenticate().token;
    getUser(userId, token).then(data => {
      if (!data || data.err) console.log(data.err);
      else {
        this.setState({ id: data._id, email: data.email, name: data.name });
      }
    });
  }

  handleChange = name => e => {
    let value = name === 'photo' ? e.target.files[0] : e.target.value;
    let fileSize = name === 'photo' ? e.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, error: '', fileSize });
  };

  clickSubmit = e => {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ loading: true });
      const { id, name, email, password } = this.state;
      // const user = { name, email, password: password || undefined }
      const token = isAuthenticate().token;
      update(id, token, this.userData).then(res => {
        if (res.err) console.log(res.err);
        else {
          updateLocalStorage(res, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (fileSize > 300000) {
      this.setState({ error: 'File size should be less than 300kb ' });
      return false;
    } else if (name.length === 0) {
      this.setState({ error: 'Name is required' });
      return false;
    } else if (!reg.test(email.toLowerCase())) {
      this.setState({ error: 'A valid Email is required' });
      return false;
    } else if (password.length > 0 && password.length < 6) {
      this.setState({ error: 'Password must have at least 6 characters' });
      return false;
    }
    return true;
  };

  signUpForm = (name, email, password) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='images/*'
          className='form-control'
        />
      </div>
      <div className='form-group'>
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
        Update
      </button>
    </form>
  );

  render() {
    const {
      name,
      email,
      password,
      id,
      redirectToProfile,
      error,
      loading
    } = this.state;
    if (redirectToProfile) return <Redirect to={`/user/${id}`} />;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profile</h2>
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

        <img
          src={`${process.env.REACT_APP_API_URL}/user/photo/${id}`}
          onError={i => (i.target.src = `${DefaultAvatar}`)}
          style={{ width: '30%', height: '15vw', objectFit: 'cover' }}
          alt={name}
        />

        {this.signUpForm(name, email, password)}
      </div>
    );
  }
}

export default EditProfile;
