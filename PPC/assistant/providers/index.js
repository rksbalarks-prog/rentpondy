// Provider selector. One interface, two implementations, chosen by env.
import config from '../config.js';
import openai from './openai.js';
import mock from './mock.js';

const providers = { openai, mock };

export function getProvider() {
  return providers[config.provider] || openai;
}

export default getProvider;
