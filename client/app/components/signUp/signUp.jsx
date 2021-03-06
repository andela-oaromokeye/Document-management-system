import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Input, Button, Row, Col } from 'react-materialize';
import toastr from 'toastr';
import * as userAction from '../../actions/userAction';

export class SignUpFormComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSignUp(this.state.firstname, this.state.lastname,
    this.state.username, this.state.password, this.state.passwordConfirmation,
    this.state.email);
    browserHistory.push('/dashboard');
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.hasError && toastr.error(this.props.error)}

        <Row>
          <h4>SIGNUP FORM:</h4>
          <Input
            className="formControl" name="firstname" s={6}
            label="First Name" value={this.state.firstname}
            onChange={this.handleChange}
          />
          <Input
            name="lastname" className="formControl" s={6}
            label="Last Name"
            value={this.state.lastname} onChange={this.handleChange}
          />
          <Input
            name="username" className="formControl" s={6}
            label="Username"
            value={this.state.username} onChange={this.handleChange}
          />
          <Input
            name="password" className="formControl" type="password"
            label="Password"
            value={this.state.password} onChange={this.handleChange} s={6}
          />
          <Input
            name="passwordConfirmation" className="formControl" s={6}
            type="password"
            label="Password confirmation"
            value={this.state.passwordConfirmation}
            onChange={this.handleChange}
          />
          <Input
            name="email" className="formControl" type="email"
            label="Email" s={6}
            value={this.state.email} onChange={this.handleChange}
          />
          <Col s={7}>
            <Button className="button" waves="light">Sign Up</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

SignUpFormComponent.propTypes = {
  handleSignUp: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
};

export const stateToProps = state => ({
  user: state.user.currentUser,
  error: state.user.error,
  hasError: state.user.hasError,
});

export const dispatchToProps = dispatch => ({
  handleSignUp: (firstname, lastname, username, password,
    passwordConfirmation, email) => dispatch(userAction.handleSignUp(firstname, lastname,
    username, password, passwordConfirmation, email)),
});

export default connect(stateToProps, dispatchToProps)(SignUpFormComponent);
