import React, { Component } from 'react';
import { isAuthenticate } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultAvatar from '../images/post.jpg';
import { createPost } from './apiPost';

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      photo: '',
      user: {},
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticate().user });
  }

  handleChange = name => e => {
    let value = name === 'photo' ? e.target.files[0] : e.target.value;
    let fileSize = name === 'photo' ? e.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, error: '', fileSize });
  };

  clickSubmit = e => {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ loading: true });
      const { user } = this.state;
      const token = isAuthenticate().token;

      createPost(user._id, token, this.postData).then(res => {
        if (res.err) console.log(res.err);
        else {
          this.setState({ redirectToProfile: true });
        }
      });
    }
  };

  isValid = () => {
    const { title, content, fileSize } = this.state;
    if (fileSize > 300000) {
      this.setState({ error: 'File size should be less than 300kb ' });
      return false;
    } else if (title.length === 0 || content.length === 0) {
      this.setState({ error: 'All field is required' });
      return false;
    }
    return true;
  };

  newPostForm = (title, content) => (
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
        <label className='text-muted'>Title</label>
        <input
          onChange={this.handleChange('title')}
          value={title}
          type='text'
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>content</label>
        <input
          onChange={this.handleChange('content')}
          value={content}
          type='text'
          className='form-control'
        />
      </div>
      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Create
      </button>
    </form>
  );

  render() {
    const {
      title,
      content,
      redirectToProfile,
      user,
      error,
      loading
    } = this.state;
    if (redirectToProfile) return <Redirect to={`/user/${user._id}`} />;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create Post</h2>
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

        {/* <img
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`}
                    onError={i => (i.target.src = `${DefaultAvatar}`)}
                    style={{ width: "30%", height: "15vw", objectFit: "cover" }}
                    alt={name}
                /> */}

        {this.newPostForm(title, content)}
      </div>
    );
  }
}

export default NewPost;
