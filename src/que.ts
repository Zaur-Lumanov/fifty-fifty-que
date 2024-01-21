import axios from "axios";

const {QUE_MERCHANT_KEY} = process.env;

const callApi = async (method: string, params: {[x: string]: string|number}) => {
  const result = await axios.get(`https://que-bot.lolkek.lol/api/${method}`, {
    params: {
      merchant_key: QUE_MERCHANT_KEY,
      ...params,
    }
  });

  return result.data;
};

export const createOrder = (amount: number) =>
  callApi('order/create', {amount});

export const sendQue = (userId: number, amount: number) =>
  callApi('merchant/send', {user_id: userId, amount});