import * as http from 'http';
import * as https from 'https';
import { join } from 'path';
import { getHomesOrigin } from '../../../utils/homes.origin';

const stage =  process.env.STAGE ?? 'test';
const path = '/machimusubi/ajax/detail/area-reviews/';
const url = join(getHomesOrigin(stage), path);
const client = url.startsWith('https') ? https : http;

const validStationId = JSON.stringify({ station_id: 574 }); //tokyo
const invalidStationId = JSON.stringify({ station_id: "string" });
const validCityId = JSON.stringify({ city_id: 13109 }); //
const invalidCityId = JSON.stringify({ city_id: "string" });

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const makeHttpRequest = (
  url: string,
  options: http.RequestOptions | https.RequestOptions,
  data: string | undefined,
  expectedStatusCode: number,
  expectedContentType: string | undefined
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = client.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk.toString('utf8');
      });

      res.on('end', () => {
        expect(res.statusCode).toBe(expectedStatusCode);
        if (expectedContentType) {
          expect(res.headers['content-type']).toContain(expectedContentType);
        }
        if (expectedStatusCode === 200) {
          expect(responseData).toMatch(/(いいね度)/i);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
};

describe('AreaReview class test', () => {
  describe('findByStationId', () => {
    describe('requests', () => {
      it('request using valid parameter', async () => {
        await makeHttpRequest(url, options, validStationId, 200, 'text/html');
      });

      it('request using invalid parameter', async () => {
        await makeHttpRequest(url, options, invalidStationId, 422, 'application/json');
      });
    });
  });

  describe('findByCityId', () => {
    describe('requests', () => {
      it('request using valid parameter', async () => {
        await makeHttpRequest(url, options, validCityId, 200, 'text/html');
      });

      it('request using invalid parameter', async () => {
        await makeHttpRequest(url, options, invalidCityId, 422, 'application/json');
      });
    });
  });
});
