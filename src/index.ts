import 'dotenv/config';
import {Telegraf} from 'telegraf';
import {createOrder, sendQue} from "./que";
import {server} from "./server";
import {ObjectId} from "mongodb";
import db from "./db";

const {BOT_TOKEN} = process.env;

if (!BOT_TOKEN) {
  console.error('Invalid BOT_TOKEN');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

server(bot);

const extra = {
  reply_markup: {
    inline_keyboard: [[
      {text: '1 $QUE', callback_data: 'add_que:1'},
      {text: '10 $QUE', callback_data: 'add_que:10'},
      {text: '100 $QUE', callback_data: 'add_que:100'},
    ]],
  },
};

bot.start((ctx) => {
  ctx.reply('Выберите сумму', extra)
});

bot.action(/^add_que:(\d+)$/, async (ctx) => {
  const amount = +ctx.match[1];

  try {
    const order = await createOrder(amount);

    ctx.reply(`Пополните счёт на ${amount} $QUE`, {
      reply_markup: {
        inline_keyboard: [[{text: 'Оплатить', url: order.link}]],
      },
    });
  } catch (err) {}
});

bot.action(/^dice:(\w+)$/, async (ctx) => {
  const orderId = ctx.match[1];
  await ctx.deleteMessage();
  const result = await ctx.sendDice();

  const order = await db.orders.findOne({
    _id: new ObjectId(orderId),
  });

  if (!order) {
    return;
  }

  setTimeout(() => {
    if (result.dice.value > 3) {
      ctx.reply(`Вы выиграли ${order.amount} $QUE!\n\nВыберите новую ставку:`, extra);

      sendQue(order.user_id, order.amount);
    } else if (result.dice.value < 4) {
      ctx.reply(`Вы проиграли ${order.amount} $QUE :(\n\nВыберите новую ставку:`, extra);
    }
  }, 3000);
})

void bot.launch();