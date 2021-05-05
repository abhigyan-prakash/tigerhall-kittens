import CallContext from '../../boot/call_context';
import { getTigerList } from '../../logic/tiger';
import { fetchAllTigers } from '../../models/tiger';

jest.mock('../../models/tiger');

let testContext = null;

describe('logic - tiger', () => {
  beforeEach(() => {
    testContext = new CallContext();
  });

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
          last_seen_at: '2021-05-04T10:44:49.000Z',
          last_seen: { x: -22.015, y: 79.1234 },
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
          last_seen_at: '2021-05-04T10:49:42.000Z',
          last_seen: { x: 178.8237, y: -13.0057 },
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
        lastSeen: { lat: 79.1234, lng: -22.015 },
        image: 'http://mockimage1'
      },
      {
        id: 'mock tiger id 2',
        name: 'mock name 2',
        dateOfBirth: '2019-06-22T00:00:00.000Z',
        lastSeenAt: '2021-05-04T10:49:42.000Z',
        lastSeen: { lat: -13.0057, lng: 178.8237 },
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
