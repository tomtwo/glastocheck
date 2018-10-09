const axios = require('axios');

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

class HTTPError extends Error {
  constructor(...args) {
    super(...args);
  }

  toString() {
    return 'HTTPError';
  }
}

class TelegramMessageAdapter {
  constructor(token) {
    this.token = token;
  }

  async _makeRequest({
    method = 'get',
    endpoint = '',
    data = {},
    token = this.token,
  }) {
    if (!endpoint) {
      throw new Error('endpoint required');
    }

    const res = await axios({
      method: method,
      url: `https://api.telegram.org/bot${token}/${endpoint}`,
      [method.toLowerCase() === 'get' ? 'params' : 'data']: {
        ...data,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(err => {
      console.log('err>', err.response.data);

      throw new HTTPError(err);
    });

    return res.data;
  }

  async sendMessage(chatId, message) {
    const trimmedMsg = message.length > TELEGRAM_MAX_MESSAGE_LENGTH
      ? (message.slice(0, TELEGRAM_MAX_MESSAGE_LENGTH - 3) + '..')
      : message;

    return await this._makeRequest({
      method: 'post',
      endpoint: 'sendmessage',
      data: {
        chat_id: chatId,
        text: trimmedMsg || '<blank message>',
        parse_mode: 'markdown',
        disable_web_page_preview: true,
        // disable_notification: false,
      },
    }).then(res => {
      // console.log('msg>', chatId, message);

      return res;
    });
  }

  async setWebhook(url) {
    return await this._makeRequest({
      method: 'post',
      endpoint: 'setwebhook',
      data: {
        url: url,
      },
    });
  }

  async getWebhook() {
    return await this._makeRequest({
      method: 'post',
      endpoint: 'getWebhookInfo',
      data: {
        // bla
      },
    });
  }

  async clearWebhook() {
    return await this._makeRequest({
      method: 'post',
      endpoint: 'deletewebhook',
    });
  }
}

module.exports = TelegramMessageAdapter;
