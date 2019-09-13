import React, { Component } from 'react';
import { getAllPost } from './apiPost';
import DefaultAvatar from '../images/post.jpg';
import { Link } from 'react-router-dom';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    getAllPost().then(data => {
      if (data.err) console.log(data.err);
      else this.setState({ posts: data });
    });
  }

  renderPost(posts) {
    return (
      <div className='row'>
        {posts.map(post => {
          let photoUrl = post
            ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}`
            : DefaultAvatar;
          const posterId = post.postedBy ? post.postedBy._id : '';
          const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
          return (
            <div className='card col-md-3 mr-5 mb-5' key={post._id}>
              <img
                className='card-img-top'
                src={photoUrl}
                onError={i => (i.target.src = `${DefaultAvatar}`)}
                style={{ width: '100%', height: '15vw', objectFit: 'cover' }}
                alt='Card image cap'
              />
              <div className='card-body'>
                <h5 className='card-title'>{post.title}</h5>
                <p className='card-text'>{post.content.substring(0, 50)}</p>
                <br />
                <p className='font-italic mark'>
                  Posted By <Link to={`/user/${posterId}`}>{posterName} </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className='btn btn-primary btn-raised btn-sm'
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { posts } = this.state;
    return (
      <div className='container'>
        {!posts.length || posts.length == 'undefined' ? (
          <div className='jumbotron text-center'>
            <h2>Welcome to Social Network</h2>
          </div>
        ) : (
          <h2 className='mt-5 mb-5'>Recent Posts</h2>
        )}

        {this.renderPost(posts)}
      </div>
    );
  }
}

export default Posts;
