import axios from "axios";

const apiKey = process.env.REACT_APP_COINGECKO_API_KEY;

export const getCoinData = (id, setError) => {
  const coin = axios
    .get(`https://api.coingecko.com/api/v3/coins/${id}`,
      {
        headers: {
          "x-cg-demo-api-key": apiKey,
        },
      }
    )
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((e) => {
      console.log(e.message);
      if (setError) {
        setError(true);
      }
    });

  return coin;
};
