import db from "./db";
import {ExtraReplyMessage} from "telegraf/typings/telegram-types";
import {locales} from "./locales";

export type Status = 'wins' | 'loses';

export const pluralize: (...args: [string, string, string])
  => (v: number) => string
  = (a, b, c) => v => (v % 100 > 10 && v % 100 < 15) ? c : [c, a, b, b, b, c, c, c, c, c][v % 10];

export const filterMV2 = (text: string | number) =>
  ([undefined, null].includes(text as any) ? '' : text).toString().replace(/([._*\[\]()~`>#+\-=|{}])/mg, '\\$1');

const pWinners = pluralize('победа', 'победы', 'побед');

const pLosers = pluralize('поражение', 'поражения', 'поражений');

export const getPluralize = (status: Status, lang = 'en') => lang === 'ru'
  ? (status === 'wins' ? pWinners : pLosers)
  : (_: number) => status === 'wins' ? 'wins' : 'loses';

export const getTopText = async (status: Status, lang = 'en') => {
  const users = await db.users.find({[status]: {$gt: 0}}).sort({[status]: -1}).limit(50).toArray();

  return '*' + (locales(lang)[status === 'wins' ? 'topWinners' : 'topLosers']) + ':*\n\n' +
    (users.length ? users.map((user, index) =>
      `${index + 1}\\. ${(user.username) ? `@${filterMV2(user.username)}` : `id${user.user_id}`} – ${user[status]} ${getPluralize(status, lang)(user[status])}`
    ).join('\n') : locales(lang).noBody);
};

export const getTopExtra = <T = ExtraReplyMessage>(status: Status, lang = 'en') => ({
  parse_mode: 'MarkdownV2',
  reply_markup: {
    inline_keyboard: [[
      status === 'wins'
        ? {text: locales(lang).topLosers, callback_data: 'top:loses'}
        : {text: locales(lang).topWinners, callback_data: 'top:wins'},
    ], [{text: locales(lang).play, callback_data: 'start'}]],
  },
}) as T;
