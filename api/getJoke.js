import axios from 'axios'

const getJoke = async (req, res) => {

  axios
    .get('https://api.chucknorris.io/jokes/random')
    .then(apiRes => {
      res.json({
        body: apiRes.data,
        error: null,
      })
    })
    .catch(() => {
      res.json({
        body: null,
        error: 'There was an error getting the joke',
      })
    })
}

export default getJoke