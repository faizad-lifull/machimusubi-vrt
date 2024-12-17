import { getHomesOrigin } from './src/utils/homes.origin';

declare global {
  var homesOrigin: string;
}

global.homesOrigin = getHomesOrigin(process.env.STAGE ?? '');