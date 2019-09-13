import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../images/avatar.png';

class ProfileTabs extends Component {
  render() {
    const { followers, following, posts } = this.props;
    return (
      <div>
        <div className='row'>
          <div className='col-md-4'>
            <h3 className='text-primary'>Followers</h3>
            <hr />
            <hr />
            {followers &&
              followers.map(person => (
                <div key={person._id}>
                  <div className='row'>
                    <Link to={`/user/${person._id}`}>
                      <img
                        style={{
                          borderRadius: '50%',
                          border: '2px solid black'
                        }}
                        className='mr-3'
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                        onError={i => (i.target.src = `${DefaultAvatar}`)}
                        alt={person.name}
                        height='40px'
                        weight='40px'
                      />
                      <h3 className='lead' style={{ display: 'inline' }}>
                        {person.name}
                      </h3>
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          <div className='col-md-4'>
            <h3 className='text-primary'>Following</h3>
            <hr />
            <hr />
            {following &&
              following.map(person => (
                <div key={person._id}>
                  <div className='row'>
                    <div>
                      <Link to={`/user/${person._id}`}>
                        <img
                          style={{
                            borderRadius: '50%',
                            border: '2px solid black'
                          }}
                          className='mr-3'
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                          onError={i => (i.target.src = `${DefaultAvatar}`)}
                          alt={person.name}
                          height='40px'
                          weight='40px'
                        />
                        <h3 className='lead' style={{ display: 'inline' }}>
                          {person.name}
                        </h3>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className='col-md-4'>
            <h3 className='text-primary'>Posts</h3>
            <hr />
            <hr />
            {posts.map(post => (
              <div key={post._id}>
                <Link to={`/post/${post._id}`}>
                  <p className='lead'>{post.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
