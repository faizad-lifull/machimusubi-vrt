import { getHomesOrigin } from '../utils/homes.origin';

export const userAgent = {
  pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
  sp: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  tablet:
    'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
};

export const homesV5OemId = {
  pc: '48',
  sp: '10025',
  tablet: '10031',
};

export const viewport = {
  pc: { width: 1280, height: 720 },
  sp: { width: 390, height: 844 }
};

export const isHeadless = process.env.IS_HEADLESS == 'false'? false : true;

export const homesOrigin = getHomesOrigin(process.env.STAGE ?? '');

export const jestTimeout = 100000;
