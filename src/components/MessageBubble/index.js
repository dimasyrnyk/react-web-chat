import './MessageBubble.scss'

export const MessageBubble = ({ creds, message }) => {
  const sender = message.sender
  const notMe = creds.userName !== sender.username
  const messageClass = notMe ? 'received' : 'sended'
  let text = message.text ? message.text : ''
  text = text.replaceAll('<p>', '').replaceAll('</p>', '')

  const date = new Date(message.created).toLocaleString('en-US', {
    day : 'numeric',
    month : '2-digit',
    year : 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return (
    <>
      <div className={`message-co ${messageClass}`}>
        { notMe &&
          <img
            className="user-avatar"
            src={sender.avatar !== null ? sender.avatar : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQskYeiHyZ7jcqk7mHZlnho0BbdvtFPIUo0jsmY7xzwYnqZPCUreAFOTFFj0xsuAB5oWcY&usqp=CAU'}
            alt="Avatar"
          />
        }
        <div className={`message-bubble-co ${messageClass}`}>
          <div className={`message-bubble ${messageClass}`}>{text}</div>
          <span className="message-date">
          { date }
        </span>
        </div>

      </div>
    </>
  )
}
