import React from 'react';
import { connect } from 'react-redux';
import UserNameForm from 'views/components/sign-up/username';
// import { authActions } from 'core/auth';


import { PropTypes } from 'prop-types';

export function UserName({signUp}) {
  return (
    <div className="container">
        <UserNameForm signUp={signUp}/>
    </div>
  );
}

// SignUp.propTypes = {
//   signUp: PropTypes.func.isRequired
// };


//=====================================
//  CONNECT
//-------------------------------------

export default UserName;
