import db from "./db";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types";

export type Status = 'wins' | 'loses';

export const pluralize: (...args: [string, string, string])
  => (v: number) => string
  = (a, b, c) => v => (v % 100 > 10 && v % 100 < 15) ? c : [c, a, b, b, b, c, c, c, c, c][v % 10];

export const filterMV2 = (text: string | number) =>
  ([undefined, null].includes(text as any) ? '' : text).toString().replace(/([._*\[\]()~`>#+\-=|{}])/mg, '\\$1');

const pWinners = pluralize('победа', 'победы', 'побед');

const pLosers = pluralize('поражение', 'поражения', 'поражений');

export const getPluralize = (status: Status) => status === 'wins' ? pWinners : pLosers;

export const getTopText = async (status: Status) => {
  const users = await db.users.find({[status]: {$gt: 0}}).sort({[status]: -1}).limit(50).toArray();

  return '*' + (status === 'wins' ? 'Топ выигравших:' : 'Топ проигравших:') + '*\n\n' +
    (users.length ? users.map((user, index) =>
      `${index + 1}\\. ${(user.username) ? `@${filterMV2(user.username)}` : `id${user.user_id}`} – ${user[status]} ${getPluralize(status)(user[status])}`
    ).join('\n') : 'Никого нет :\\(');
};

export const getTopExtra = <T = ExtraReplyMessage>(status: Status) => ({
  parse_mode: 'MarkdownV2',
  reply_markup: {
    inline_keyboard: [[
      status === 'wins' ? {text: 'Топ проигравших', callback_data: 'top:loses'} : {text: 'Топ выигравших', callback_data: 'top:wins'},
    ], [{text: 'Играть', callback_data: 'start'}]],
  },
}) as T;
