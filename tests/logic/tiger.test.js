import CallContext from '../../boot/call_context';
import {
  getTigerList,
  getTigerSightingsById,
  getTigerByName
} from '../../logic/tiger';
import {
  fetchAllTigers,
  fetchTiger,
  fetchTigerSightings
} from '../../models/tiger';

jest.mock('../../models/tiger');

let testContext = null;

describe('logic - tiger', () => {
  beforeEach(() => {
    testContext = new CallContext();
  });

  describe('test getTigerList', () => {
    test('get tiger list', async () => {
      fetchAllTigers.mockImplementation(() => {
        return [
          {
            id: 'mock id 1',
            sighting_id: 'mock id 1',
            name: 'mock name 1',
            date_of_birth: '2020-04-08T00:00:00.000Z',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:44:49.000Z',
            seen_cord_lng: -22.015,
            seen_cord_lat: 79.1234,
            image: 'http://mockimage1'
          },
          {
            id: 'mock id 2',
            sighting_id: 'mock id 2',
            name: 'mock name 2',
            date_of_birth: '2019-06-22T00:00:00.000Z',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 2',
            seen_at: '2021-05-04T10:49:42.000Z',
            seen_cord_lng: 178.8237,
            seen_cord_lat: -13.0057,
            image: 'http://mockimage2'
          }
        ];
      });

      let result = await getTigerList(testContext);
      expect(result).toEqual([
        {
          id: 'mock tiger id 1',
          name: 'mock name 1',
          dateOfBirth: '2020-04-08T00:00:00.000Z',
          lastSeenAt: '2021-05-04T10:44:49.000Z',
          lastSeenCord: { lat: 79.1234, lng: -22.015 },
          image: 'http://mockimage1'
        },
        {
          id: 'mock tiger id 2',
          name: 'mock name 2',
          dateOfBirth: '2019-06-22T00:00:00.000Z',
          lastSeenAt: '2021-05-04T10:49:42.000Z',
          lastSeenCord: { lat: -13.0057, lng: 178.8237 },
          image: 'http://mockimage2'
        }
      ]);
    });

    test('get tiger list - empty list', async () => {
      fetchAllTigers.mockImplementation(() => []);

      let result = await getTigerList(testContext);
      expect(result).toEqual([]);
    });

    test('get tiger list - throws error', async () => {
      fetchAllTigers.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await getTigerList(testContext);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('test getTigerSightingsById', () => {
    let mockTigerId = 'mock tiger id 1';

    test('get tiger sightings', async () => {
      fetchTigerSightings.mockImplementation(() => {
        return [
          {
            id: 'mock id 1',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:44:49.000Z',
            seen_cord_lng: -22.015,
            seen_cord_lat: 79.1234,
            image: 'http://mockimage1'
          },
          {
            id: 'mock id 2',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:49:42.000Z',
            seen_cord_lng: 178.8237,
            seen_cord_lat: -13.0057,
            image: 'http://mockimage2'
          }
        ];
      });

      let result = await getTigerSightingsById(testContext, mockTigerId);
      expect(result).toEqual([
        {
          id: 'mock id 1',
          seenAt: '2021-05-04T10:44:49.000Z',
          seenCord: { lat: 79.1234, lng: -22.015 },
          image: 'http://mockimage1'
        },
        {
          id: 'mock id 2',
          seenAt: '2021-05-04T10:49:42.000Z',
          seenCord: { lat: -13.0057, lng: 178.8237 },
          image: 'http://mockimage2'
        }
      ]);
    });

    test('get tiger sighting - no tiger id provided', async () => {
      let result = await getTigerSightingsById(testContext);
      expect(result).toEqual(null);
    });

    test('get tiger sighting - no sightings', async () => {
      fetchTigerSightings.mockImplementation(() => []);

      let result = await getTigerSightingsById(testContext, mockTigerId);
      expect(result).toEqual([]);
    });

    test('get tiger sighting - throws error', async () => {
      fetchTigerSightings.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await getTigerSightingsById(testContext, mockTigerId);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('test fetchTigerByName', () => {
    let mockTigerName = 'mock tiger name';

    test('get tiger - no tiger name provided', async () => {
      let result = await getTigerByName(testContext);
      expect(result).toEqual(null);
    });

    test('get tiger - no tiger info', async () => {
      fetchTiger.mockImplementation(() => {});

      let result = await getTigerByName(testContext, mockTigerName);
      expect(result).toEqual(null);
    });

    test('get tiger - throws error', async () => {
      fetchTiger.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await getTigerByName(testContext, mockTigerName);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('get tiger - fetches tiger by name', async () => {
      fetchTiger.mockImplementation(() => {
        return {
          id: 'mock tiger id',
          sighting_id: 'mock sighting id',
          name: 'mock name',
          date_of_birth: '2020-04-08T00:00:00.000Z',
          created_at: '2021-05-04T22:37:43.000Z',
          updated_at: '2021-05-04T22:37:43.000Z'
        };
      });

      let result = await getTigerByName(testContext, mockTigerName);
      expect(result).toEqual({
        id: 'mock tiger id',
        name: 'mock name',
        dateOfBirth: '2020-04-08T00:00:00.000Z'
      });
    });
  });
});
