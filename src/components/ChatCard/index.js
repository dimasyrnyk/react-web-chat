import { useState, useEffect, useContext } from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { ChatEngineContext } from 'react-chat-engine'
import { notMe } from '../../helpers'
import { useChat } from '../../context'
import './ChatCard.scss'

export const ChatCard = ({ chat }) => {
    const [messageText, setMessageText] = useState(cutText(chat.last_message.text))
    const { chatConfig } = useChat()
    const { setActiveChat } = useContext(ChatEngineContext)
    
    const person = notMe(chatConfig, chat)

    const hasReadLastMessage = chat => {
        let lastReadMessageID = -1
        chat.people.forEach(chat_person => {
          if (chat_person.person.username === chatConfig.userName) {
            lastReadMessageID = chat_person.last_read
          }
        })
        return !chat.last_message.id || lastReadMessageID === chat.last_message.id
    }

    useEffect(() => {
        setMessageText(cutText(chat.last_message.text))
    }, [chat.last_message.text])

    function cutText(text) {
        return text.length > 30 ? text.substr(0, 30).concat('...') : text
    }


    return (
        <>
            {
                person &&
                <div className="chat-card-co" onClick={() => setActiveChat(chat.id)}>
                    <div className="chat-card-left-side">
                        <span className="user-avatar-co">
                            <img
                                className="user-avatar"
                                src={person.avatar ? person.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQskYeiHyZ7jcqk7mHZlnho0BbdvtFPIUo0jsmY7xzwYnqZPCUreAFOTFFj0xsuAB5oWcY&usqp=CAU"}
                                alt="Avatar"
                            />
                            <CheckCircleOutlineIcon
                                className={ person.is_online ? "status-online" : "status-ofline"}
                                style={{ fontSize: 18 }}
                            />
                        </span>
                        <span className="chat-card-info">
                            <h3 className="chat-card-title">{person.username}</h3>
                            <span
                                className={ hasReadLastMessage(chat) ?
                                    "chat-card-message" :
                                    "chat-card-message not-readed"
                                }
                            >
                                { messageText || 'Type your message...' }                    
                            </span>
                        </span>
                    </div>
                    <span className="chat-card-date">
                        {
                            chat.last_message.created &&
                            new Date(chat.last_message.created).toLocaleString('en-GB', {
                                month : 'short',
                                day : 'numeric',
                                year : 'numeric'
                            })
                        }
                    </span>
                </div>
            }
        </>
    )
}