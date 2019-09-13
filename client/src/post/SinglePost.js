import React, { Component } from 'react';
import { isAuthenticate } from '../auth';
import DefaultAvatar from '../images/post.jpg';
import { getPost, likePost, unlikePost } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import DeletePost from './DeletePost';
import Comment from './Comment';
class SinglePost extends Component {
  state = {
    post: {},
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };

  componentDidMount() {
    if (!isAuthenticate()) return this.setState({ redirectToSignin: true });
    const token = isAuthenticate().token;
    const postId = this.props.match.params.postId;
    getPost(postId, token).then(data => {
      if (data.err) console.log(data.err);
      this.setState({
        post: data,
        likes: data.likes.length,
        like: this.checkLike(data.likes),
        comments: data.comments
      });
    });
  }

  checkLike = data => {
    const userId = isAuthenticate().user._id;
    return data.indexOf(userId) > -1;
  };

  likeToggle = () => {
    const token = isAuthenticate().token;
    const postId = this.props.match.params.postId;
    const userId = isAuthenticate().user._id;
    let callApi = this.state.like ? unlikePost : likePost;
    callApi(postId, token, userId).then(data => {
      if (data.err) console.log(data.err);
      this.setState({ like: !this.state.like, likes: data.likes.length });
    });
  };

  updateComments = comments => {
    this.setState({ comments: comments });
  };

  render() {
    const {
      post,
      loading,
      likes,
      like,
      redirectToSignin,
      comments
    } = this.state;
    let photoUrl = post
      ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}`
      : DefaultAvatar;
    const posterId = post.postedBy ? post.postedBy._id : '';
    const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
    if (redirectToSignin) return <Redirect to='/signin' />;
    return (
      <div className='container'>
        {!post.title ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <h2 className='mt-5 mb-5 display-2'>{post.title}</h2>
            <img
              className='card-img-top'
              src={photoUrl}
              onError={i => (i.target.src = `${DefaultAvatar}`)}
              style={{ width: '100%', height: '30vw', objectFit: 'cover' }}
              alt='Card image cap'
            />
            <br />
            <br />

            {!like ? (
              <h3 onClick={this.likeToggle}>
                <i className='fas fa-thumbs-up text-info'>
                  {''} {likes} Like
                </i>
              </h3>
            ) : (
              <h3 onClick={this.likeToggle}>
                <i className='fas fa-thumbs-down text-danger'>
                  {''} {likes} Like
                </i>
              </h3>
            )}
            <p className='card-text'>{post.content}</p>
            <br />
            <p className='font-italic mark'>
              Posted By <Link to={`/user/${posterId}`}>{posterName}</Link>
              on {new Date(post.created).toDateString()}
            </p>
            <Link to={`/`} className='btn btn-primary btn-raised btn-sm mr-5'>
              Back to posts
            </Link>
            {isAuthenticate().user && isAuthenticate().user._id == posterId ? (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-success mr-5'
                  to={`/post/edit/${post._id}`}
                >
                  Update Post
                </Link>
                <DeletePost postId={post._id} />
              </div>
            ) : (
              ''
            )}
          </>
        )}
        <Comment
          postId={post._id}
          comments={comments}
          updateComments={this.updateComments}
          comments={comments}
        />
      </div>
    );
  }
}

export default SinglePost;
