import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {firebaseAuth,firebaseDb} from 'core/firebase'
import {history} from 'core/store'
class UserNameForm extends Component {
  // static propTypes = {
  //   signUp: PropTypes.func.isRequired
  // };

  constructor(props, context) {
    super(props, context);

    this.state = {newUserName : {}};
    this.onSubmit = ::this.onSubmit;
  }

  clearInput() {
    this.setState({user : {}});
  }

  handleChange(propertyName, event) {
      const newUserName = this.state.newUserName;
      newUserName[propertyName] = event.target.value;
      this.setState({newUserName: newUserName });
  }

  onSubmit(event) {
    event.preventDefault();
    const username = this.state.newUserName.text.trim();
    console.log(this)
    console.log("tt")
    console.log(firebaseAuth)
    let uid = firebaseAuth.currentUser.uid
    console.log(uid)
    console.log(firebaseDb)
    firebaseDb.ref("users").child(uid).child("name").set(username)
    history.push("/chat")
    console.log("finish Test")
    // if (password.length && password === passwordConfirmation) 
      // this.props.signUp(login, password);
  }

  render() {
    return (
      <div id="login">
        <form className="login-form" onSubmit={this.onSubmit}>
          <span className="fa fa-user"></span>
          <input
            autoFocus
            maxLength="25"
            onChange={this.handleChange.bind(this, 'text')}
            placeholder="UserName"
            type="texts"
            value={this.state.newUserName.text}
            required
          />

          <input type="submit" value="Sign Up"/>
        </form>
      </div>
    );
  }
}

export default UserNameForm;
