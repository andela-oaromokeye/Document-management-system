import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import App from './components/main';
import initialState from '../store/initialState.js';
import '../styles/styles.css';
import '../../node_modules/toastr/build/toastr.min.css';
import Document from './components/document/document';
import configureStore from '../store/configureStore.js';
import Main from './components/main';
import SignUpForm from './components/signUp/signUp';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import UpdateDocument from './components/document/updateDocument';
import UpdateUser from './components/user/updateUser';
import Users from './components/user/users';
import Roles from './components/role/roleDashboard';
import Search from './components/search/search';


const store = configureStore;
const onEnter = (next, replace, cb) => {
   const token = localStorage.getItem('token');
  if(!token && next.location.pathname.indexOf('dashboard') > -1) {
    replace('/login');
  }
  if(token && (next.location.pathname.indexOf('login') > -1 || next.location.pathname.indexOf('signup') > -1)) {
    replace('/dashboard');
  }
  cb();
}
render(
<Provider store={store}>
<Router history={browserHistory}>
  <Route path="/" component={Main}>
    <IndexRedirect to="/login" />
    <Route path="dashboard/document" component={Document} onEnter={onEnter}/>
    <Route path="signup" component={SignUpForm} onEnter={onEnter} />
    <Route path="login" component={Login} onEnter={onEnter} />
    <Route path="dashboard" component={Dashboard} onEnter={onEnter}/>
    <Route path="updateDoc" component={UpdateDocument} onEnter={onEnter}/>
    <Route path="updateUser/:id" component={UpdateUser} onEnter={onEnter}/>
    <Route path="users" component={Users} onEnter={onEnter}/>
    <Route path="roles" component={Roles} onEnter={onEnter}/>
    <Route path="search/users/" component={Search} onEnter={onEnter}/>
  </Route>
</Router>
</Provider>,
 document.getElementById('app'));
