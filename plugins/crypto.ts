export default defineNuxtPlugin(() => {
  if (process.server) {
    const crypto = require('~/plugins/crypto');
    global.crypto = crypto;
  }
})
