import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { authActions, getAuth } from 'core/auth';
import { paths } from '../routes';
import Header from '../components/header';
import classNames from 'classnames';

import { PropTypes } from 'prop-types';
import { history} from 'core/store'
import {firebaseAuth, firebaseDb} from 'core/firebase'

import {setUser,clearUser} from 'core/chat/actions'
// import {history} from 'core/stire'
console.log("init views App")
export class App extends Component {
  static contextTypes = {
    // router: PropTypes.object.isRequired
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
    signOut: PropTypes.func.isRequired
  };

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
        if (user) {
            // console.log(user);
            // setUser(user);
            let uid = user.uid;
            console.log(firebaseDb)
            firebaseDb.ref("users").child(uid).once('value', function(snapshot) {
              var exists = (snapshot.val() !== null);
              console.log("check if user exists")
              console.log({exists})
              if(exists){
                history.push("/chat");
              }else{
                history.push("/username")
              }
            });
            console.log("views/app/index  user")
            console.log(user)
            
        } else {
            history.push("/sign-in");
            // clearUser();
        }
    });
  }
  componentDidUpdate(prevProps) {
    const { router } = this.context;
    const { auth } = this.props;
    console.log("views/app/index.js componentDidUpdate")
    // e = this
    console.log({ prevProps, auth, router })
    if (auth.authenticated && !prevProps.auth.authenticated) {
      console.log("go to HOME ")
      history.replace(paths.HOME);
      
    }
    else if (!auth.authenticated && prevProps.auth.authenticated) {
      console.log("go to SIGN IN ")
      history.replace(paths.SIGN_IN);
      
    }
  }

  render() {
    return (
      <div>
       
        <div className={classNames({'loading-app': this.props.auth.loading})}></div>
        <Header
          authenticated={this.props.auth.authenticated}
          signOut={this.props.signOut}
        />

        <main className="main">{this.props.children}</main>
      </div>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getAuth,
  auth => ({auth})
);

export default connect(
  mapStateToProps,
  authActions
)(App);
