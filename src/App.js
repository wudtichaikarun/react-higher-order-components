import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

// Display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function forAuth(WrappedComponent) {
  class Enhance extends Component {

    // show display name
    static displayName = `ForAuth(${getDisplayName(WrappedComponent)})`

    render() {
      const props = this.props
      const { isLogin, credential, ...rest } = props
      const auth = { isLogin, credential }

      return props.isLogin ? <WrappedComponent {...rest } auth={auth} /> : null
    }
  } 

  return hoistNonReactStatic(Enhance, WrappedComponent)
}

// Use Higher Order Component Log message 
function logProps(WrappedComponent) {
  class Enhance extends Component {

    // show display name
    static displayName = `LogProps(${getDisplayName(WrappedComponent)})`

    componentWillReceiveProps(nextProps) {
      console.log('Prev Props', this.props)
      console.log('Next Props', nextProps)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistNonReactStatic(Enhance, WrappedComponent)
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

function fetchData(WrappedComponent, endpoint) {
  class Enhance extends Component {

    // show display name
    static displayName = `FetchData(${getDisplayName(WrappedComponent)})`

    state = {
      fetchData: {}
    }

    componentDidMount() {
      fetchApi(endpoint)
        .then(fetchData => this.setState({ fetchData }))
        .catch(err => console.log(err.message))
    }
    render() {
      return <WrappedComponent {...this.props } {...this.state }/>
    }
  }

  return hoistNonReactStatic(Enhance, WrappedComponent)
}

// Component ------------------------------------
class ProtectedComponent extends Component {

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
/* ###############################################
        Component (Higher Order Component)
   ############################################### */
const EnhancedComponent = fetchData(
  logProps(forAuth(ProtectedComponent)),
  '/articles'
)

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
