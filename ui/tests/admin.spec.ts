import { expect, test } from '@playwright/test';
import { AdminPage } from '../page-objects/admin';
import { Homepage } from '../page-objects/homepage';

test.describe('Admin authentication and dashboard', () => {
  test('logs in and verifies public homepage room details match admin rooms', async ({ page }) => {
    const homepage = new Homepage(page);
    const admin = new AdminPage(page);

    await homepage.goto();
    const publicRooms = await homepage.getListedRoomDetails();

    await admin.goto();
    await admin.login();
    await admin.expectDashboardOrInboxVisible();
    await admin.gotoRooms();

    for (const publicRoom of publicRooms) {
      const adminRoom = await admin.getRoomDetails(publicRoom);

      expect(adminRoom).toEqual(publicRoom);
    }
  });
});
