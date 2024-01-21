import express from 'express';
import {Context, Telegraf} from "telegraf";
import {createHmac} from "crypto";
import db from "./db";

const {CB_API_CONFIRM_CODE, QUE_MERCHANT_KEY, PORT} = process.env;

const app = express();

export const server = (bot: Telegraf<Context>) => {
  app.get('/', async (req, res) => {
    if (req.query.action === 'confirm') {
      return res.send({"code": CB_API_CONFIRM_CODE});
    }

    if (req.query.order_key) {
      const sign = createHmac('sha256', QUE_MERCHANT_KEY!)
        .update(
          Object.keys(req.query)
            .sort()
            .filter((key) => key !== 'sign')
            .map((key) => `${key}=${req.query[key]}`)
            .join('')
        )
        .digest()
        .toString('hex');

      if (sign === req.query.sign) {
        const {insertedId} = await db.orders.insertOne({
          user_id: +(req.query.user_id as string),
          amount: +(req.query.amount as string),
        });

        await bot.telegram.sendMessage(
          req.query.user_id as string,
          `Пополнение на ${req.query.amount} $QUE\n\nПравила игры: от 4 до 6 – выигрыл, от 1 до 3 – проигрыш.`,
          {
            reply_markup: {
              inline_keyboard: [[{text: 'Бросить кость', callback_data: `dice:${insertedId}`}]],
            },
          },
        ).catch(() => {});
      }
    }

    res.sendStatus(200);
  });

  app.listen(+PORT! || 8083);
}