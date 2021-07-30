import './Notification.scss'

export const Notification = ({ message }) => {
    return (
        <>
            {
                message && (
                    <div className="notification-co">
                        <span className="notification-title">
                        {message.sender_username}
                        </span>
                        <p>
                        {
                            message.text.length > 400 ?
                            message.text.substr(0, 400).concat('...') :
                            message.text
                        }
                        </p>
                    </div>
                )
            }
        </>
    )
}