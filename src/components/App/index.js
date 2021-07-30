import { useEffect } from 'react'
import { ChatProvider } from '../../context'
import { useAuth, useResolved } from '../../hooks'
import { SignIn, SignUp, Chat, Loader, Navigation } from '../'
import { Switch, Route, useHistory } from 'react-router-dom'

export const App = () => {
  const history = useHistory()
  const { authUser } = useAuth()
  const authResolved = useResolved(authUser)

  useEffect(() => {
    if (authResolved) {
      history.push(!!authUser ? '/' : '/signin')
    }
  }, [authResolved, authUser, history])

  if (!authResolved) {
    return <Loader />
  }

  return (
    <>
      <ChatProvider authUser={authUser}>
        <Navigation />
        <div className="app">
          <Switch>
            <Route path="/" exact component={Chat} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </ChatProvider>
    </>
  )
}