import axios from "axios";

const apiKey = process.env.REACT_APP_COINGECKO_API_KEY;

export const get100Coins = () => {
  const coins = axios
    .get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      {
        headers: {
          "x-cg-demo-api-key": apiKey,
        },
      }
    )
    .then((response) => {
      console.log("RESPONSE>>>", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log("ERROR>>>", error.message);
    });

  return coins;
};
