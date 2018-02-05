import React, { Component } from 'react'

function forAuth(WrappedComponent) {
  // nomal way use react component
  /*
  return class extends Component {
    render() {
      const props = this.props
      return props.isLogin ? <WrappedComponent {...props } /> : null
    }
  } */

  // best way use stateless fun. component
  return props => props.isLogin ? <WrappedComponent {...props }/> : null
}

// Nomal stateless fun. component
const ProtectedComponent = ({ isLogin }) => (
  <h2>Protected Content: {isLogin.toString()}</h2>
)

// Higher Order Component
const EnhancedComponent = forAuth(ProtectedComponent)

class App extends Component {

  state = {
    isLogin: false
  }

  toggleLogin = () => {
    this.setState((prevState) => ({ isLogin: !prevState.isLogin}))
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleLogin}>Toggle</button>
        <EnhancedComponent isLogin={this.state.isLogin} />
      </div>
    );
  }
}

export default App;
