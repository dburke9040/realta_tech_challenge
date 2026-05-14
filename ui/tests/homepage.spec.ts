import { expect, test } from '@playwright/test';
import { Homepage } from '../page-objects/homepage';

type Room = {
  type: string;
};

test.describe('Homepage sanity', () => {
  test('shows the contact form and booking buttons for listed room types', async ({ page, request }) => {
    const homepage = new Homepage(page);
    const roomsResponse = await request.get('/api/room');
    const { rooms } = (await roomsResponse.json()) as { rooms: Room[] };

    await expect(roomsResponse).toBeOK();

    await homepage.goto();
    await homepage.expectContactFormVisible();

    for (const room of rooms) {
      await homepage.expectRoomCanBeBooked(room.type);
    }
  });
});
