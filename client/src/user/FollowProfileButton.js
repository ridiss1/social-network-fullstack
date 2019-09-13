import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {
  onFollow = () => this.props.onFollowButtonClick(follow);
  onUnFollow = () => this.props.onUnFollowButtonClick(unfollow);

  render() {
    return (
      <div className='d-inline-block'>
        {this.props.following ? (
          <button
            className='btn btn-raised btn-warning'
            onClick={this.onUnFollow}
          >
            Unfollow
          </button>
        ) : (
          <button
            className='btn btn-raised btn-primary mr-5'
            onClick={this.onFollow}
          >
            Follow
          </button>
        )}
      </div>
    );
  }
}

export default FollowProfileButton;
