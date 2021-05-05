import { headingDistanceTo } from 'geolocation-utils';
import CallContext from '../../boot/call_context';
import {
  getTigerList,
  getTigerSightingsById,
  getTigerByName,
  createTiger,
  getTigerById,
  createTigerSighting,
  validateSightCords
} from '../../logic/tiger';
import {
  addTiger,
  addTigerSighting,
  fetchAllTigers,
  fetchTiger,
  fetchTigerById,
  fetchTigerSightings
} from '../../models/tiger';
import { getImagePath } from '../../utils/image';

jest.mock('../../models/tiger');
jest.mock('../../utils/image');
jest.mock('geolocation-utils');

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
            image: 'mock-image.png'
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
            image: 'mock-image.png'
          }
        ];
      });

      getImagePath.mockImplementation(() => {
        return '/image/mock-image.png';
      });

      let result = await getTigerList(testContext);
      expect(result).toEqual([
        {
          id: 'mock tiger id 1',
          name: 'mock name 1',
          dateOfBirth: '2020-04-08T00:00:00.000Z',
          lastSeenAt: '2021-05-04T10:44:49.000Z',
          lastSeenCord: { lat: 79.1234, lng: -22.015 },
          image: '/image/mock-image.png'
        },
        {
          id: 'mock tiger id 2',
          name: 'mock name 2',
          dateOfBirth: '2019-06-22T00:00:00.000Z',
          lastSeenAt: '2021-05-04T10:49:42.000Z',
          lastSeenCord: { lat: -13.0057, lng: 178.8237 },
          image: '/image/mock-image.png'
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
            image: 'mock-image.png'
          },
          {
            id: 'mock id 2',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:49:42.000Z',
            seen_cord_lng: 178.8237,
            seen_cord_lat: -13.0057,
            image: 'mock-image.png'
          }
        ];
      });

      getImagePath.mockImplementation(() => {
        return '/image/mock-image.png';
      });

      let result = await getTigerSightingsById(testContext, mockTigerId);
      expect(result).toEqual([
        {
          id: 'mock id 1',
          seenAt: '2021-05-04T10:44:49.000Z',
          seenCord: { lat: 79.1234, lng: -22.015 },
          image: '/image/mock-image.png'
        },
        {
          id: 'mock id 2',
          seenAt: '2021-05-04T10:49:42.000Z',
          seenCord: { lat: -13.0057, lng: 178.8237 },
          image: '/image/mock-image.png'
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

  describe('test getTigerByName', () => {
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

  describe('test createTiger', () => {
    let mockTigerData = {
      name: 'mock name',
      date_of_birth: '2020-04-08T00:00:00.000Z',
      lastSeenAt: '2021-05-04T10:44:49.000Z',
      seenCord: { lat: -13.0057, lng: 178.8237 },
      image: 'mock-image.png'
    };

    test('create tiger - no tiger data provided', async () => {
      let result = await createTiger(testContext);
      expect(result).toEqual(false);
    });

    test('create tiger - throws error', async () => {
      addTiger.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await createTiger(testContext, mockTigerData);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('create tiger - successful', async () => {
      addTiger.mockImplementation(() => {});

      let result = await createTiger(testContext, mockTigerData);
      expect(result).toEqual(true);
    });
  });

  describe('test getTigerById', () => {
    let mockTigerId = 'mock tiger id';

    test('get tiger - no tiger id provided', async () => {
      let result = await getTigerById(testContext);
      expect(result).toEqual(null);
    });

    test('get tiger - no tiger info', async () => {
      fetchTigerById.mockImplementation(() => {});

      let result = await getTigerById(testContext, mockTigerId);
      expect(result).toEqual(null);
    });

    test('get tiger - throws error', async () => {
      fetchTigerById.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await getTigerById(testContext, mockTigerId);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('get tiger - fetches tiger by id', async () => {
      fetchTigerById.mockImplementation(() => {
        return {
          id: 'mock tiger id',
          sighting_id: 'mock sighting id',
          name: 'mock name',
          date_of_birth: '2020-04-08T00:00:00.000Z',
          created_at: '2021-05-04T22:37:43.000Z',
          updated_at: '2021-05-04T22:37:43.000Z'
        };
      });

      let result = await getTigerById(testContext, mockTigerId);
      expect(result).toEqual({
        id: 'mock tiger id',
        name: 'mock name',
        dateOfBirth: '2020-04-08T00:00:00.000Z'
      });
    });
  });

  describe('test createTigerSighting', () => {
    let mockSightingData = {
      tigerId: 'mock tiger id',
      seenAt: '2021-05-04T10:44:49.000Z',
      lat: -13.0057,
      lng: 178.8237,
      image: 'mock-image.png'
    };

    test('create tiger sighting - no tiger sighting data provided', async () => {
      let result = await createTigerSighting(testContext);
      expect(result).toEqual(false);
    });

    test('create tiger sighting - throws error', async () => {
      addTigerSighting.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await createTigerSighting(testContext, mockSightingData);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('create tiger sighting - successful', async () => {
      addTigerSighting.mockImplementation(() => {});

      let result = await createTigerSighting(testContext, mockSightingData);
      expect(result).toEqual(true);
    });
  });

  describe('test validateSightCords', () => {
    let mockTigerId = 'mock tiger id';
    let mockCords = { lat: 1.364917, lng: 103.822872 };
    let mockRadius = 10;

    test('validate sighting cords - no tiger id provided', async () => {
      let result = await validateSightCords(testContext);
      expect(result).toEqual(false);
    });

    test('validate sighting cords - no sighting cords provided', async () => {
      let result = await validateSightCords(testContext, mockTigerId);
      expect(result).toEqual(false);
    });

    test('validate sighting cords - no radius provided', async () => {
      let result = await validateSightCords(
        testContext,
        mockTigerId,
        mockCords
      );
      expect(result).toEqual(false);
    });

    test('validate sighting cords - no previous tiger sightings', async () => {
      fetchTigerSightings.mockImplementation(() => []);

      let result = await validateSightCords(
        testContext,
        mockTigerId,
        mockCords,
        mockRadius
      );
      expect(result).toEqual(true);
    });

    test('validate sighting cords - error fetching previous tiger sightings', async () => {
      fetchTigerSightings.mockImplementation(() => {
        throw new Error('mock error');
      });

      try {
        let result = await validateSightCords(
          testContext,
          mockTigerId,
          mockCords,
          mockRadius
        );
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('validate sighting cords - fetched previous tiger sightings; cords within radius', async () => {
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
            image: 'mock-image.png'
          },
          {
            id: 'mock id 2',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:49:42.000Z',
            seen_cord_lng: 178.8237,
            seen_cord_lat: -13.0057,
            image: 'mock-image.png'
          }
        ];
      });

      headingDistanceTo.mockImplementation(() => {
        return 4000;
      });

      let result = await validateSightCords(
        testContext,
        mockTigerId,
        mockCords,
        mockRadius
      );
      expect(result).toEqual(false);
    });

    test('validate sighting cords - fetched previous tiger sightings; cords outside radius', async () => {
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
            image: 'mock-image.png'
          },
          {
            id: 'mock id 2',
            created_at: '2021-05-04T22:37:43.000Z',
            updated_at: '2021-05-04T22:37:43.000Z',
            tiger_id: 'mock tiger id 1',
            seen_at: '2021-05-04T10:49:42.000Z',
            seen_cord_lng: 178.8237,
            seen_cord_lat: -13.0057,
            image: 'mock-image.png'
          }
        ];
      });

      headingDistanceTo.mockImplementation(() => {
        return 6000;
      });

      let result = await validateSightCords(
        testContext,
        mockTigerId,
        mockCords,
        mockRadius
      );
      expect(result).toEqual(false);
    });
  });
});
