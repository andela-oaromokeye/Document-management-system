import React from 'react';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import _ from 'underscore';

import { browserHistory } from 'react-router';
import * as adminAction from '../../actions/adminAction.js';
import toastr from 'toastr';
import { Input, Button, Row, Col, Icon } from 'react-materialize';

class UpdateUser extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
        firstname: '',
        lastname: ''
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount () {
    this.setState({
      id: this.props.user.UserId,
      firstname: this.props.user.firstname,
      lastname: this.props.user.lastname,
    });
  }

   handleChange(event) {
      this.setState({ [event.target.name]: event.target.value });
   }

   handleSubmit(event) {
    event.preventDefault();
    console.log(this.props.user);
    this.props.handleUpdateUser({...this.state});
    browserHistory.push('/dashboard');
   }

   render() {
      return (
         <form onSubmit={this.handleSubmit}>
          {/*{this.props.hasError && toastr.error(this.props.error)}*/}

            <Row>
              <h4>UPDATE USER FORM:</h4>
              <Input className="formControl" name="firstname" s={6}
              label="First Name" value={this.state.firstname}
              onChange={this.handleChange}/>
              <Input name="lastname" className="formControl" s={6}
              label="Last Name"
              value={this.state.lastname} onChange={this.handleChange}/>
              <Button className="button" waves='light' onClick={this.handleSubmit}>Update User</Button>
            </Row>
         </form>
      );
   }
}

const stateToProps = (state, ownProps) => {
  const token = localStorage.getItem('token');
  const decoded = jwt(token);
  console.log('decoded', decoded);
  const RoleId = decoded.RoleId;
  const id = parseInt(decoded.UserId, 10);
  console.log('id', id);
  // console.log('store', store);
  console.log('state', state);


  return {
    user: decoded,
  }
};

const dispatchToProps = (dispatch) => {
  return {
    handleUpdateUser: (id, firstname, lastname) => dispatch(adminAction.handleUpdateUser(id, firstname, lastname))
  };
}

export default connect(stateToProps, dispatchToProps) (UpdateUser);
