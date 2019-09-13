import React, { Component } from 'react';
import { isAuthenticate } from '../auth';
import { newComment } from './apiPost';
import DefaultAvatar from '../images/avatar.png';
import { Link } from 'react-router-dom';
import DeleteComment from './DeleteComment';

class Comment extends Component {
  state = {
    text: '',
    error: ''
  };

  handleChange = e => this.setState({ text: e.target.value });

  isValid = () => {
    const { text } = this.state;
    if (text.length === 0 || text.length > 150) {
      this.setState({
        error: 'Comment should not be empty and less than 150 characters long'
      });
      return false;
    }
    return true;
  };

  addComment = e => {
    e.preventDefault();
    if (this.isValid()) {
      const userId = isAuthenticate().user._id;
      const token = isAuthenticate().token;
      const postId = this.props.postId;
      const comment = { text: this.state.text };

      newComment(postId, token, userId, comment).then(data => {
        if (data.err) console.log(data.err);
        this.setState({ text: '' });
        this.props.updateComments(data.comments);
        console.log(data.comments);
      });
    }
  };

  render() {
    const { text, error } = this.state;
    const { comments } = this.props;
    return (
      <div>
        <h2 className='mt-5 mb-5'>Leave a comment</h2>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              onChange={this.handleChange}
              placeholder='My comment...'
              value={text}
              type='text'
              className='form-control'
            />
          </div>
        </form>

        <div>
          <h3 className='text-primary'>{comments.length} Comments</h3>
          <hr />
          {comments &&
            comments.map(comment => (
              <div key={comment._id}>
                <div className='row'>
                  <div>
                    <Link to={`/user/${comment.postedBy._id}`}>
                      <img
                        style={{
                          borderRadius: '50%',
                          border: '2px solid black'
                        }}
                        className='mr-3'
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                        onError={i => (i.target.src = `${DefaultAvatar}`)}
                        alt={comment.postedBy.name}
                        height='40px'
                        weight='40px'
                      />
                      <h3 className='lead' style={{ display: 'inline' }}>
                        {comment.text}
                      </h3>
                    </Link>
                    <br />
                    <span
                      className='font-italic mark'
                      style={{ paddingRight: '120%' }}
                    >
                      Posted By{' '}
                      <Link to={`/user/${comment.postedBy._id}`}>
                        {comment.postedBy.name}
                      </Link>
                      {'  '}on {new Date(comment.created).toDateString()}
                      {isAuthenticate().user &&
                      isAuthenticate().user._id == comment.postedBy._id ? (
                        <DeleteComment
                          userId={comment.postedBy._id}
                          postId={this.props.postId}
                          commentId={comment._id}
                          updateComments={this.props.updateComments}
                        />
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </div>
                <hr />
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default Comment;
