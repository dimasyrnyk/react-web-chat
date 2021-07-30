import SearchIcon from '@material-ui/icons/Search'

export const NewChat = ({ handleChange, value, onSubmit }) => {
    return (
        <form className="new-chat-form" onSubmit={onSubmit}>
            <button type="submit" className="send-button">
                <SearchIcon style={{ fontSize: 18 }} />
            </button>
            <input
                className="new-chat-input"
                placeholder="Search or start a new chat"
                value={value}
                onChange={handleChange}
            />
        </form> 
    )
}