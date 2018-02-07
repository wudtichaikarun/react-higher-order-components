import React, { Component } from 'react'

function forAuth(WrappedComponent) {
  return class extends Component {
    render() {
      const props = this.props
      const { isLogin, credential, ...rest } = props
      const auth = { isLogin, credential }

      return props.isLogin ? <WrappedComponent {...rest } auth={auth} /> : null
    }
  } 
}

// Use Higher Order Component Log message 
function logProps(WrappedComponent) {
  /* Compositon Note: use compositon beter than inheritance
  link we talking before composition over inneritance
  */
  return class extends Component {
    componentWillReceiveProps(nextProps) {
      console.log('Prev Props', this.props)
      console.log('Next Props', nextProps)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

// API MOCKUP
function fetchApi(endpoint) {
  return new Promise((resolve, reject) => {
    if(!endpoint) return reject(new Error('Endpoint is required.'))

    return resolve({
      articles: [
        {id: 1, title: 'Article#1'},
        {id: 2, title: 'Article#2'},
        {id: 3, title: 'Article#3'}
      ]
    })
  })
}

function fetchData(WrappedComponent) {
  return class extends Component {
    state = {
      fetchData: {}
    }

    componentDidMount() {
      fetchApi(WrappedComponent.API_ENDPOINT)
        .then(fetchData => this.setState({ fetchData }))
        .catch(err => console.log(err.message))
    }
    render() {
      return <WrappedComponent {...this.props } {...this.state }/>
    }
  }
}

// Component ------------------------------------
class ProtectedComponent extends Component {
  static API_ENDPOINT = '/articles'

  state = {
    fetchData: {}
  }

  render() {
    const { fetchData: { articles }} = this.props

    return (
      <ul>
        {
          articles && articles.map( ({ id, title }) =>
            <li key={id}>{title}</li> )
        }
      </ul>
    )
  }
}

// Component (Higher Order Component)------------
const EnhancedComponent = logProps(forAuth(fetchData(ProtectedComponent)))

// Component ------------------------------------
class App extends Component {

  state = {
    isLogin: false,
    credential: {}
  }

  toggleLogin = () => {
    this.setState((prevState) => {
      const { isLogin } = prevState

      if(isLogin) return { isLogin: false, credential: {} }

      return {
        isLogin: true,
        credential: { email: 'romantic@hotmail.com', accessToken: 'token' }
      }
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleLogin}>Toggle</button>
        <EnhancedComponent {...this.state} />
      </div>
    )
  }
}

export default App;
