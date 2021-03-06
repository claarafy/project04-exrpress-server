import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import clientAuth from './clientAuth'
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl"
import TheMap from './TheMap'



class App extends Component {
  ///////////////////////////////////////constructor
  constructor() {
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      view: 'home' //changing the view along with the routes
    }
  }
  ///////////////////////////////////////componentDidMount
  componentDidMount() {
    const currentUser = clientAuth.getCurrentUser()
    this.setState({
      currentUser: currentUser,
      loggedIn: !!currentUser,
      view: 'home'
    })
  }

  ////////////////////////////////////////////////custom functions
  _signUp(newUser) {
    clientAuth.signup(newUser).then((data) => {
      this.setState({
        view:'login'
      })
    })
  }

  _logIn(credentials) {
    console.log('login credentials: ', credentials)
    clientAuth.login(credentials).then((user) => {
      this.setState({
        currentUser: user,
        loggedIn: true,
        view: 'home'
      })
    })
  }

  _logOut() {
  clientAuth.logout().then((message) => { //message is optional
    console.log(message)
    this.setState({
      currentUser: null,
      loggedIn: false,
      view: 'home' //redirect back to home view
    })
  })
}

_setView(evt) {
  // evt.preventDefault()
  const view = evt.target.name
  this.setState({
    view: view
  })
}
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>NO LALA LAND</h2>
        </div>
        <div className="row" id="navbar">
          <div className="column column-offset-55">
            {!this.state.loggedIn && (
            <button name='signup' className="button button-clear" onClick={this._setView.bind(this)}>Sign Up</button>
            )}
            {!this.state.loggedIn && (
            <button name='login' className="button button-clear" onClick={this._setView.bind(this)}>Login</button>
            )}
            {this.state.loggedIn && (
            <button className="button button-clear" onClick={this._logOut.bind(this)}>Log Out</button>
            )}
          </div>
        </div>
        {{ //outer: jsx inner": object
          home: '',
          login: <LogIn onLogin={this._logIn.bind(this)} />,
          signup: <SignUp onSignup={this._signUp.bind(this)} />
        }[this.state.view]}
        <TheMap />
      </div>
    )
  }
}

////////////////////////////////////////////////SUBCLASSES
////////////////////////////////////////////////SignUp Class
class SignUp extends React.Component {
  _handleSignup(evt) {
    evt.preventDefault()
    const newUser = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onSignup(newUser) //onSignup is a property, can be called whatever
  }
  render() {
    return(
      <div className='container'>
        <h2>Sign Up</h2>
        <form onSubmit={this._handleSignup.bind(this)}>
          <input type="text" placeholder="Name" ref="name" />
          <input type="text" placeholder="Email" ref="email" />
          <input type="password" placeholder="Password" ref="password" />
          <button type="submit">Create Account</button>
        </form>
      </div>
    )
  }
}
////////////////////////////////////////////////Login Class
class LogIn extends React.Component {
  _handleLogin(evt) {
    evt.preventDefault()
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onLogin(credentials)
  }
  render() {
    return(
      <div className='container'>
        <h2>Log In</h2>
        <form onSubmit={this._handleLogin.bind(this)}>
          <input type="text" placeholder="Email" ref="email" />
          <input type="password" placeholder="Password" ref="password" />
          <button type="submit">Log In</button>
        </form>
      </div>
    )
  }
}

export default App;
