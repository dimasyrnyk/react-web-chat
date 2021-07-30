import { fb } from '../../service'
import { useState, useEffect, useContext } from 'react'
import {
  getChats,
  addPerson,
  getMyData,
  getOrCreateChat,
  ChatEngineContext,
} from 'react-chat-engine'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { ChatCard, NewChat, Loader } from '../'
import { useChat } from '../../context'
import { useResolved } from '../../hooks'
import './ChatList.scss'


export const ChatList = props => {
  const [value, setValue] = useState('')
  const [me, setMe] = useState()
  const [users, setUsers] = useState([])
  const [searching, setSearching] = useState(false)
  const [sortedChats, setSortedChats] = useState([])
  const { myChats, setMyChats, chatConfig } = useChat()
  const chatsResolved = useResolved(myChats)
  const { setActiveChat } = useContext(ChatEngineContext)

  useEffect(() => {
    getMyData(chatConfig, (data) => setMe(data))
    getChats(chatConfig, (chats) => {
      setSortedChats(chats.sort((a, b) => a.last_message.id + b.last_message.id))
    })
  }, [chatsResolved, props.messages])

  useEffect(() => {
    const usersArr = []
    // get users from firebase except for the authorized user
    fb.firestore
      .collection("chatUsers").where("userName", "!=", chatConfig.userName).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          usersArr.push(doc.data())
      })
      if (usersArr.length > 0) setUsers(usersArr)
    })
    
  }, []) 

  const onDirectMessageCreate = (name) => {
    const chat = { 
      is_direct_chat: true,
      title: 'chat',
      usernames: [name]
    }
    getOrCreateChat(chatConfig, chat, (chat) => {
      addPerson(chatConfig, chat.id, name, () => {
        setActiveChat(chat.id)        
      })
    })
    setSearching(false)
    setValue('') 
  }

  const handleChange = (event) => {
    setValue(event.target.value)
    if (event.target.value.length > 0) {
      setSearching(true)
    } else {
      setSearching(false)
    }
  }

  if (!chatsResolved) {
    return <Loader />
  }

  return (
    <div className="chat-left-side-co">
      <div className="chat-user-co">
        {
          me &&
          <div className="chat-user-avatar">
          <span className="user-avatar-co">
            <img
              className="user-avatar"
              src={me.avatar ? me.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQskYeiHyZ7jcqk7mHZlnho0BbdvtFPIUo0jsmY7xzwYnqZPCUreAFOTFFj0xsuAB5oWcY&usqp=CAU"}
              alt="Avatar"
            />
            <CheckCircleOutlineIcon
              className={ me.is_online ? "status-online" : "status-ofline"}
              style={{ fontSize: 18 }}
            />
          </span>
          </div>
        }
        <NewChat 
          title='Direct Messages' 
          placeholder='Type a username'
          value={value}
          handleChange={handleChange}
          onSubmit={onDirectMessageCreate}
        />
      </div>

      {
        searching ? (
          <>
            {/* <SearchUsers closeSearch={() => setSearching(false)} /> */}
            <h3 className="chat-list-title">Users</h3>
            <div className="chat-list-co">
              { 
                users.length > 0 &&
                users.filter(u => {
                  return u.userName.toLowerCase().indexOf(value.toLowerCase()) !== -1
                }).map(user => {
                  return (
                    <span
                      className="chat-card-co"
                      key={user.userCode}
                      onClick={() => onDirectMessageCreate(user.userName)}
                    >
                      {user.userName}
                    </span>
                  )
                })
              }
            </div>
          </>
        ) : (
          <>
            <h3 className="chat-list-title">Chats</h3>
            <div className="chat-list-co">
              { 
                sortedChats &&
                sortedChats.map((chat, index) => {
                  return (
                    <ChatCard
                      key={index}
                      chat={chat}
                    />
                  )
                })
              }
            </div>
          </>
        )        
      }
    </div>
  )
}