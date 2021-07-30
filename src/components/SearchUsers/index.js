import './SearchUsers.scss'

export const SearchUsers = ({ users, value, onClick}) => {
  return (
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
                onClick={() => onClick(user.userName)}
              >
                {user.userName}
              </span>
            )
          })
        }
      </div>
    </>
  )
}