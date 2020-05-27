import React from 'react';
import { connect } from 'react-redux';
import SignUpForm from '../../components/sign-up';
import { authActions } from 'core/auth';


import { PropTypes } from 'prop-types';

export function SignUp({signUp}) {
  return (
    <div className="container">
        <SignUpForm signUp={signUp}/>
    </div>
  );
}

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------

export default connect(null, authActions)(SignUp);
