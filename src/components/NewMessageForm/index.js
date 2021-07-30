import { fb } from '../../service'
import { useState, useEffect } from 'react'
import { sendMessage } from 'react-chat-engine'
import SendIcon from '@material-ui/icons/Send'
import { notMe } from '../../helpers'
import { useChat } from '../../context'
import './NewMessageForm.scss'

export const NewMessageForm = (props) => {
  const { chatID, creds } = props
  const { chatConfig } = useChat()
  const [value, setValue] = useState('')
  const [user, setUser] = useState('')
  const [userCreds, setUserCreds] = useState({})

  useEffect(() => {
    if (creds.chats !== null && chatID !== null) {
      // get user from chat engine without secret
      setUser(notMe(chatConfig, creds.chats[chatID.toString()]))      
    }
  }, [creds, chatID, chatConfig])

  useEffect(() => {
    if (user) {
      // get user from firebase with secret for chat engine
      fb.firestore
        .collection("chatUsers").where("userCode", "==", user.last_name).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setUserCreds({
              projectID: creds.projectID,
              userName: user.username,
              userSecret: doc.id
            })
          })
      })
    }
  }, [user, chatID, creds])

  const fetchChuckNorriceJoke = async () => {
    const response = await fetch('/api/getJoke')
    if (response.ok) {
      const joke = await response.json()
      if (joke.body !== null) {
        // send joke to user
        sendMessage(userCreds, chatID, {
          text: joke.body.value,
          sender_username: userCreds.userName
        }, () => {})
      }
    } else {
      console.log('Chuck Norris response: ', response)
    }
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = value.trim()

    if (text.length > 0) {
      sendMessage(creds, chatID, { text, sender_username: creds.userName }, () => {})
      setTimeout(() => {
        fetchChuckNorriceJoke()
      }, 10000) // send an answer to the user in 10 seconds
    }
    setValue('')
  }

  return (
    <>
      { chatID &&
        <div className="message-form-co">
          <form className="message-form" onSubmit={handleSubmit}>
            <input
              className="message-input"
              placeholder="Type your message"
              value={value}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
            <button type="submit" className="send-button">
              <SendIcon />
            </button>
          </form>            
        </div>
      }
    </>
  )
}
