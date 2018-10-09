'use strict';

const config = require('./config');
const TelegramMessageAdapter = require('./lib/telegram');
const GlastoChecker = require('./lib/glasto');

const telegram = new TelegramMessageAdapter(config.TELEGRAM_TOKEN);
const glasto = new GlastoChecker();

const TELEGRAM_CHANNEL_CHAT_ID = '-1001237648529';

module.exports.test = async (event, context) => {
  try {
    const isAvailable = await glasto.checkAvailable();

    return {
      success: true,
      isAvailable: isAvailable,
    };
  } catch (err) {
    console.error('failed:', err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports.test_telegram = async (event, context) => {
  try {
    const res = await telegram.sendMessage(
      TELEGRAM_CHANNEL_CHAT_ID,
      'I will send a message here if "tickets have now sold out" disappears from https://glastonbury.seetickets.com'
    );

    console.log('got res from telegram>', res);

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports.check = async (event, context) => {
  let isAvailable;

  try {
    isAvailable = await glasto.checkAvailable();
  } catch (err) {
    console.error('failed check:', err.message);

    return {
      success: false,
      stage: 'check',
      error: err.message,
    };
  }

  if (!isAvailable) {
    return {
      success: true,
      stage: 'check',
      isAvailable: false,
    };
  }

  // tickets on sale! notify

  try {
    const res = await telegram.sendMessage(
      TELEGRAM_CHANNEL_CHAT_ID,
      `Possible Glastonbury ticket sale detected at: ${glasto.glastoUrl}`
    );

    console.log('got res from telegram>', res);

    return {
      success: true,
      stage: 'notify',
      isAvailable: true,
    };
  } catch (err) {
    return {
      success: false,
      stage: 'notify',
      error: err.message,
    };
  }
};
