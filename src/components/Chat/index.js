import { useEffect, useState } from 'react'
import { ChatEngine, getChats } from 'react-chat-engine'
import { ChatList, ChatHeader, MessageBubble, NewMessageForm, Notification } from '../'
import { useChat } from '../../context'
import './Chat.scss'

export const Chat = () => {
  const [newMessage, setNewMessage] = useState(null)
  const {
    myChats,
    setMyChats,
    chatConfig,
    selectedChat
  } = useChat()

  const showNotification = (message) => {
    setNewMessage(message)
    setTimeout(() => {
      setNewMessage(null)
    }, 3000)
  }

  useEffect(() => {
    console.log('My Chats: ', myChats)
  }, [myChats])

  useEffect(() => {
    console.log('Selected Chat: ', selectedChat)
  }, [selectedChat])

  return (
    <>
      <div className="chat-container">
        {!!chatConfig && (
          <ChatEngine
            height='94vh'
            userName={chatConfig.userName}
            projectID={chatConfig.projectID}
            userSecret={chatConfig.userSecret}
            onConnect={() => {getChats(chatConfig, setMyChats)}}
            onNewMessage={(chatId, message) => {         
              if (message.sender_username !== chatConfig.userName) {
                showNotification(message)
              }
            }}
            // Custom UI components
            renderChatList={(chatAppState) => <ChatList {...chatAppState} />}
            renderChatHeader={(chat) => <ChatHeader chat={chat} chatConfig={chatConfig} />}
            renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) =>
              <MessageBubble message={message} creds={creds} />
            }
            renderNewMessageForm={(creds, chatID) => <NewMessageForm creds={creds} chatID={chatID} />}

          />
        )}
      </div>
      <Notification message={newMessage} />
    </>
  )
}
