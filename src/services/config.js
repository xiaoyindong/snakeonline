let SERVICE_PREFIX = 'openapi.';

const hostname = window.location.hostname.replace(/ihospital\w+\./, '');

const Pattern = /(\d{6})?(\d{3})?(\d{2})?\.([a-zA-Z]*\d?\.)?/;
const CHANNEL = hostname.match(Pattern);
if (CHANNEL && CHANNEL[4]) {
  let env = CHANNEL[4] || '';

  if (env.includes('openweimai')) {
    env = '';
  }
  
  if (env) {
    env = env.replace('dev', 'test');
    SERVICE_PREFIX = `openapi-${env}`;
  }
}

const baseURL = `//${SERVICE_PREFIX}myweimai.com/`;

export { baseURL };
