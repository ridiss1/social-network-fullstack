import React, { Component } from 'react';
import { isAuthenticate, signout } from '../auth';
import { removePost } from './apiPost';
import { Redirect } from 'react-router-dom';

class DeletePost extends Component {
  state = {
    redirect: false
  };

  deletePost = () => {
    const token = isAuthenticate().token;
    const postId = this.props.postId;
    removePost(postId, token).then(data => {
      if (data.err) console.log(data.err);
      else {
        this.setState({ redirect: true });
      }
    });
  };

  deleteComfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete your post?');
    if (answer) this.deletePost();
  };

  render() {
    const { redirect } = this.state;
    if (redirect) return <Redirect to='/' />;
    return (
      <div onClick={this.deleteComfirmed} className='btn btn-raised btn-danger'>
        Delete Post
      </div>
    );
  }
}

export default DeletePost;
