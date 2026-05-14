import { expect, type Locator, type Page } from '@playwright/test';
import type { PublicRoomDetails } from './homepage';

export class AdminPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin');
  }

  async login(username = 'admin', password = 'password'): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectDashboardOrInboxVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
    await expect(this.page.getByRole('navigation')).toContainText(/Rooms|Messages/);
    await expect(this.page).toHaveURL(/\/admin\/(rooms|message|dashboard|inbox)/);
  }

  async gotoRooms(): Promise<void> {
    await this.page.getByRole('link', { name: /^Rooms$/ }).click();
    await expect(this.page).toHaveURL(/\/admin\/rooms/);
  }

  roomListings(): Locator {
    return this.page.getByTestId('roomlisting');
  }

  roomListingFor(room: PublicRoomDetails): Locator {
    return this.roomListings()
      .filter({ has: this.page.locator(`p[id="type${room.type}"]`) })
      .filter({ has: this.page.locator(`p[id="roomPrice${room.price}"]`) })
      .filter({ has: this.page.locator('p', { hasText: room.details }) });
  }

  roomColumn(roomRow: Locator, columnIndex: number): Locator {
    return roomRow.locator('xpath=./div').nth(columnIndex);
  }

  async expectRoomDetailsVisible(room: PublicRoomDetails): Promise<void> {
    const adminRoom = await this.getRoomDetails(room);

    expect(adminRoom).toEqual(room);
  }

  async getRoomDetails(room: PublicRoomDetails): Promise<PublicRoomDetails> {
    const roomRow = this.roomListingFor(room);

    await expect(roomRow).toBeVisible();

    return {
      type: (await this.roomColumn(roomRow, 1).innerText()).trim(),
      price: (await this.roomColumn(roomRow, 3).innerText()).trim(),
      details: (await this.roomColumn(roomRow, 4).innerText()).trim()
    };
  }
}
