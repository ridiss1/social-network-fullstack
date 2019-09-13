import React, { Component } from 'react';
import { isAuthenticate, signout } from '../auth';
import { removeUser } from './apiUser';
import { Redirect } from 'react-router-dom';

class DeleteProfile extends Component {
  state = {
    redirect: false
  };

  deleteAcount = () => {
    const token = isAuthenticate().token;
    const userId = this.props.userId;
    removeUser(userId, token).then(data => {
      if (data.err) console.log(data.err);
      else {
        signout(() => console.log('Delete success'));
        this.setState({ redirect: true });
      }
    });
  };

  deleteComfirmed = () => {
    let answer = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (answer) this.deleteAcount();
  };

  render() {
    const { redirect } = this.state;
    if (redirect) return <Redirect to='/' />;
    return (
      <div onClick={this.deleteComfirmed} className='btn btn-raised btn-danger'>
        Delete Profile
      </div>
    );
  }
}

export default DeleteProfile;
