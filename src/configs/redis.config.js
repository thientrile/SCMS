'use strict';

const { createClient } = require('redis');
const { db } = require('./init.config');

let client = {},
  statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
  },
  connectionTimeout;
const REDIS_CONNECT_TIMEOUT = 100000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: 'Kết nối tới Redis thất bại',
      en: 'Connect to Redis failed',
    },
  };

let retryCount = 0; // to track retry attempts

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    console.error(REDIS_CONNECT_MESSAGE.message.en);
    connectRedis(); // Retry connection on timeout
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = ({ connectingRedis }) => {
  connectingRedis.on(statusConnectRedis.CONNECT, () => {
    console.log('Connecting Redis - Status: Connected');
    clearTimeout(connectionTimeout); // Clear timeout on successful connection
  });

  connectingRedis.on(statusConnectRedis.END, () => {
    console.log('Connecting Redis - Status: Disconnected');
  });

  connectingRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('Connecting Redis - Status: Reconnected');
    handleTimeoutError(); // Reset timeout on reconnect
  });

  connectingRedis.on(statusConnectRedis.ERROR, (err) => {
    console.error(`Connecting Redis - Status: Error ${err}`);
    handleTimeoutError(); // Reset timeout on error
  });
};

const connectRedis = async () => {
  try {
    await client.intanceConnect.connect();
  } catch (err) {
    console.log('Redis connecting Error::', err);
    closeRedis();
    // retryCount++;
    // const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
    // console.log(`Retrying in ${delay} ms...`);
    // setTimeout(() => {
    //   connectRedis();
    // }, delay);
  }
};

const init = () => {
  const instanceRedis = createClient(db.redis);
  client.intanceConnect = instanceRedis;

  handleEventConnect({
    connectingRedis: instanceRedis,
  });

  connectRedis();
};

const getRedis = () => client;

const closeRedis = async () => {
  try {
    if (client.intanceConnect) {
      await client.intanceConnect.quit(); // Properly disconnect
      console.log('Redis connection closed successfully.');
    } else {
      console.log('No active Redis connection to close.');
    }
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  } finally {
    client = {}; // Reset client object
  }
};

module.exports = {
  init,
  getRedis,
  closeRedis,
};
