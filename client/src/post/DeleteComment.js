import React, { Component } from 'react';
import { isAuthenticate, signout } from '../auth';
import { deleteComment } from './apiPost';
import { Redirect } from 'react-router-dom';

class DeleteComment extends Component {
  removeComment = () => {
    const token = isAuthenticate().token;
    const postId = this.props.postId;
    const userId = this.props.userId;
    const comment = { _id: this.props.commentId };
    deleteComment(postId, token, userId, comment).then(data => {
      if (data.err) console.log(data.err);
      else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteComfirmed = () => {
    let answer = window.confirm(
      'Are you sure you want to delete your comment?'
    );
    if (answer) this.removeComment();
  };

  render() {
    return (
      <div
        onClick={this.deleteComfirmed}
        className='btn-danger btn'
        style={{ float: 'right', marginTop: '-3%' }}
      >
        Remove
      </div>
    );
  }
}

export default DeleteComment;
