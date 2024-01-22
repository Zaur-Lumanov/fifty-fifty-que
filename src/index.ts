import 'dotenv/config';
import {Telegraf} from 'telegraf';
import {createOrder, sendQue} from "./que";
import {server} from "./server";
import {ObjectId, WithId} from "mongodb";
import db from "./db";
import {filterMV2, getPluralize, getTopExtra, getTopText, pluralize, Status} from "./utils";
import {ExtraEditMessageText, ExtraReplyMessage} from "telegraf/typings/telegram-types";

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
    ], [{text: 'Топ игроков', callback_data: 'top:wins'}]],
  },
};


bot.start((ctx) => {
  ctx.reply('Выберите сумму', extra);
});

bot.command('dice', (ctx) => {
  ctx.reply('Выберите сумму', extra);
});

bot.action('start', (ctx) => {
  ctx.reply('Выберите сумму', extra);
});

// bot.on('text', (ctx) => {
//   ctx.reply('Выберите сумму', extra);
// });

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

  const addUserInfo = (key: 'wins' | 'loses') =>
    db.users.updateOne({user_id: order.user_id}, {
      $inc: {[key]: 1},
      $setOnInsert: {
        user_id: order.user_id,
        username: ctx.update.callback_query.from.username,
      },
    }, {upsert: true});

  setTimeout(async () => {
    if (result.dice.value > 3) {
      ctx.reply(`Вы выиграли ${order.amount} $QUE!\n\nВыберите новую ставку:`, extra);

      await sendQue(order.user_id, order.amount);
      await db.orders.updateOne({_id: order._id}, {$set: {status: 'win'}});
      await addUserInfo('wins');
    } else if (result.dice.value < 4) {
      await ctx.reply(`Вы проиграли ${order.amount} $QUE :(\n\nВыберите новую ставку:`, extra);
      await db.orders.updateOne({_id: order._id}, {$set: {status: 'lose'}});
      await addUserInfo('loses');
    }
  }, 3000);
});

bot.command('top', async  (ctx) => {
  ctx.reply(await getTopText('wins'), getTopExtra('wins'));
});

bot.action(/^top:(wins|loses)/, async  (ctx) => {
  const status = ctx.match[1] as Status;

  ctx.editMessageText(await getTopText(status), getTopExtra<ExtraEditMessageText>(status)).catch(() => {});
});

void bot.launch();
