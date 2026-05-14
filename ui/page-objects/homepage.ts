import { expect, type Locator, type Page } from '@playwright/test';

export type PublicRoomDetails = {
  type: string;
  price: string;
  details: string;
};

export class Homepage {
  readonly page: Page;
  readonly contactNameInput: Locator;
  readonly bookingButtonName = /Book (this room|now)/i;

  constructor(page: Page) {
    this.page = page;
    this.contactNameInput = page.getByTestId('ContactName');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectContactFormVisible(): Promise<void> {
    await expect(this.contactNameInput).toBeVisible();
    await expect(this.page.getByTestId('ContactEmail')).toBeVisible();
    await expect(this.page.getByTestId('ContactPhone')).toBeVisible();
    await expect(this.page.getByTestId('ContactSubject')).toBeVisible();
    await expect(this.page.getByTestId('ContactDescription')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
  }

  roomCard(roomType: string): Locator {
    return this.page.locator('.room-card').filter({
      has: this.page.getByRole('heading', { name: roomType, exact: true })
    });
  }

  roomCards(): Locator {
    return this.page.locator('.room-card');
  }

  async expectRoomCanBeBooked(roomType: string): Promise<void> {
    const card = this.roomCard(roomType);

    await expect(card).toBeVisible();
    await expect(card.getByRole('link', { name: this.bookingButtonName })).toBeVisible();
  }

  async getRoomDetails(roomType: string): Promise<PublicRoomDetails> {
    const card = this.roomCard(roomType);

    return this.getRoomDetailsFromCard(card);
  }

  async getListedRoomDetails(): Promise<PublicRoomDetails[]> {
    const roomCards = this.roomCards();
    const roomCount = await roomCards.count();
    const rooms: PublicRoomDetails[] = [];

    for (let index = 0; index < roomCount; index += 1) {
      rooms.push(await this.getRoomDetailsFromCard(roomCards.nth(index)));
    }

    return rooms;
  }

  private async getRoomDetailsFromCard(card: Locator): Promise<PublicRoomDetails> {
    const priceText = await card.locator('.card-footer').innerText();
    const features = await card.locator('.badge').allInnerTexts();

    return {
      type: (await card.locator('.card-title').innerText()).trim(),
      price: priceText.match(/\d+/)?.[0] ?? '',
      details: features.map((feature) => feature.trim()).join(', ')
    };
  }
}
