import axios from 'axios'

const createUser = async (req, res) => {
  const { userId, userName, userCode } = req.body

  axios
    .put('https://api.chatengine.io/users/',
      // Add 'userCode' to 'last_name' field for an opportunity to get user in feature for Chack Norris API
      { username: userName, secret: userId, last_name: userCode },
      { headers: { 'PRIVATE-KEY': process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY } },
    )
    .then(apiRes => {
      res.json({
        body: apiRes.data,
        error: null,
      })
    })
    .catch(() => {
      res.json({
        body: null,
        error: 'There was an error creating the user',
      })
    })
}

export default createUser