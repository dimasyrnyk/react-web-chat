import { fb } from '../../service'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Button } from '../'
import './Navigation.scss'

export const Navigation = () => {
    const history = useHistory()
    const { authUser } = useAuth()
    
    return (
        <div className="app-navigation">
            <h1>REACT-CHAT</h1>
            {
                !authUser ? (
                    <Button
                        title="Sign In"
                        onClick={() => history.push('signin')}
                    />
                ) : (
                    <Button
                        title="Sign Out"
                        onClick={() => fb.auth.signOut()}
                    />
                )
            }
        </div>
    )
}