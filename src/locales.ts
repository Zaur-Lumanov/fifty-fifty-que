const localesMap = {
  en: {
    main: '🎲 Place your bet and then the dice will decide your fate. The bet will play out and you will double your $QUE. If you lose, you lose everything. \n' +
      '\n' +
      '\n' +
      '☝️🤓 The bot has no effect on the outcome of the di' +
      'ce. Pure luck. Random. Telegram.\n' +
      'Now place your bet! 🍀',
    needPay: 'Pay the bill for %coins% $QUE',
    paid: 'The account is replenished for %coins% $QUE.\n\n☝️🤓 Rules of the game: a roll of 1 to 3 means you lose, if a roll of 4 to 6 means you win.',
    rollBtn: '🎲 Roll the dice',
    win: '🫵 You won %coins% $QUE!',
    lose: '🧊 Unlucky, random has decided otherwise. You lost %coins% $QUE.',
    next: '🎲 Will you play again? Pick your next bet:',
    pay: '💸 Pay&play',
    top: 'Top players',
    play: 'Play',
    topWinners: 'Top winners',
    topLosers: 'Top losers',
    noBody: 'Nobody :\\(',
  },
  ru: {
    main: '🎲 Делай ставку и тогда кубик решит твою судьбу. Ставка сыграет и ты удвоишь свои $QUE. Если проиграешь, то потеряешь всё. \n' +
      '\n' +
      '\n' +
      '☝️🤓 Бот не влияет на исход кубика. Чистая удача. Рандом. Телеграм.\n' +
      'А теперь делай ставку! 🍀',
    needPay: 'Оплатить счёт на %coins% $QUE',
    paid: 'Счёт пополнен на %coins% $QUE\n\n☝️🤓 Правила игры: выпадает от 1 до 3 – проиграл, выпадает от 4 до 6 – выиграл.',
    rollBtn: '🎲 Бросить кубик',
    win: '🫵 Ты выиграл %coins% $QUE!',
    lose: '🧊 Не судьба, рандом распорядился иначе, ты проиграл %coins% $QUE(',
    next: '🎲 Сыграешь ещё? Выбирай следующую ставку:',
    pay: '💸 Плачу и играю',
    top: 'Топ игроков',
    play: 'Играть',
    topWinners: 'Топ победивших',
    topLosers: 'Топ проигравших',
    noBody: 'Никого нет :\\(',
  },
};

export const locales = (lang: string = 'en') => {
  return localesMap[lang === 'ru' ? 'ru' : 'en'];
};
