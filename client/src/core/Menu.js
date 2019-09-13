import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticate, isActive } from '../auth';

const Menu = ({ history }) => (
  <div>
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link className='nav-link' style={isActive(history, '/')} to='/'>
          Home
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link'
          style={isActive(history, '/users')}
          to='/users'
        >
          Users
        </Link>
      </li>
      {!isAuthenticate() ? (
        <>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signup')}
              to='/signup'
            >
              Sign Up
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, '/signin')}
              to='/signin'
            >
              Sign In
            </Link>
          </li>
        </>
      ) : (
        ''
      )}

      {isAuthenticate() ? (
        <>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, `/user/${isAuthenticate().user._id}`)}
              to={`/user/${isAuthenticate().user._id}`}
            >
              {isAuthenticate().user.name}'s profile
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(
                history,
                `/user/findpeople/${isAuthenticate().user._id}`
              )}
              to={`/user/findpeople/${isAuthenticate().user._id}`}
            >
              Find People
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              className='nav-link'
              style={isActive(history, `/post/new`)}
              to={`/post/new`}
            >
              Create Post
            </Link>
          </li>
          <li className='nav-item'>
            <a
              className='nav-link'
              style={isActive(history, '/signout', {
                cursor: 'pointer',
                color: '#fff'
              })}
              onClick={() => signout(() => history.push('/'))}
            >
              Sign Out
            </a>
          </li>
        </>
      ) : (
        ''
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
