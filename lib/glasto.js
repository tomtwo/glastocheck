const axios = require('axios');

const GLASTO_URL = 'https://glastonbury.seetickets.com/';
const GLASTO_SOLD_OUT_TERM = 'tickets have now sold out'.toLowerCase();
const GLASTO_REQUIRED_TERM = 'seetickets.com'.toLowerCase();

class GlastoChecker {
  constructor() {
    this.glastoUrl = GLASTO_URL;
  }

  async _fetchPage() {
    const response = await axios
      .request({
        method: 'get',
        url: GLASTO_URL,
      })
      .catch(err => {
        console.error('failed to fetch from glasto:', err);

        throw err;
      });

    return response.data;
  }

  async checkAvailable() {
    const html = await this._fetchPage();
    const searchText = html.toLowerCase();

    if (!searchText.includes(GLASTO_REQUIRED_TERM)) {
      throw new Error(
        'Required search term does not exist, assume page broken'
      );
    }

    // tickets are available if sold out term is missing
    return !searchText.includes(GLASTO_SOLD_OUT_TERM);
  }
}

module.exports = GlastoChecker;
