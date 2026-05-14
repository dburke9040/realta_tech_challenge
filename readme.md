Approach:

- API tests are split by branding, room, and booking.
- For the API happy paths, I used Karate matchers to check the response shape and data types as well as status codes.
- I added a couple of '@known-bug @ignore' API scenarios for issues I found during testing. I found some other issues with the API/UI below which I could have added tests for too.
- UI tests are written with page objects for the homepage and admin pages.
- The UI tests use user-facing locators where possible, like roles and visible text. For the admin room table, I used the 'data-testid="roomlisting"' because the table does not expose good accessible roles for each row/column.
- The admin test logs in, checks the authenticated state, then compares room details from the public homepage against the admin rooms page.

UI Issues Found:

- Date search is missing some validation:
  - User is able to select and submit a checkout date which is before the check-in date.
  - The reservation page also shows negative pricing when this happens.
  - User is able to search for dates in the past.
- Reservation page calendar does not navigate to the date you selected. It just opens the current month.
- Reserve Now validation is unclear:
  - Empty submit shows messages like 'must not be empty' and 'size must be between 11 and 21'.
  - The validation is also not at field level, so it is not clear what the user needs to fix.
- When the booking API returns 500, the page shows 'This page couldn't load' with Reload/Back instead of showing a useful booking error.
- User can attempt to reserve a date that is already unavailable. The homepage can still show the room card with a booking link for dates that are already reserved.
- Top nav has an 'Amenities' link, but there is no amenities section on the page.
- Footer quick links are broken.

API Issues Found:

- API is responding to an invalid date range with a set of rooms.
- Room endpoint accepts partial date filters, like only 'checkin' or only 'checkout', and returns all rooms.
- Malformed date query can hang instead of returning a validation error.
- Unknown room ID returns 500 instead of 404.
- Rooms endpoint nests the array in a 'rooms' object for no real reason.
- Booking can be created for a non-existent room.
- POST /api/booking response does not include the user's email or phone, even though it does return first name, last name, dates, etc. Either just the booking ID should be returned, or all of it should be returned for consistency.
