import { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import './ChatHeader.scss'

export const ChatHeader = ({ chat, chatConfig }) => {
    const [person, setPerson] = useState(null)
    const authUserName = chatConfig.userName

    useEffect(() => {
        if (chat) {
            setPerson(
                chat.people.find(p => p.person.username !== authUserName).person
            )
        }
    }, [chat, authUserName, person])

  return (
    <>
        { person &&
            <div className="chat-header">
                <span className="user-avatar-co">
                    <img
                        className="user-avatar"
                        src={person.avatar !== null ? person.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQskYeiHyZ7jcqk7mHZlnho0BbdvtFPIUo0jsmY7xzwYnqZPCUreAFOTFFj0xsuAB5oWcY&usqp=CAU"}
                        alt="Avatar"
                    />
                    <CheckCircleOutlineIcon
                        className={ person.is_online ? "status-online" : "status-ofline"}
                        style={{ fontSize: 18 }}
                    />
                </span>
                <h2 className="chat-header-title">{person.username}</h2>

            </div>        
        }
    </>
  )
}
