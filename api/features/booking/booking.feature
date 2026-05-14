Feature: Booking API

  Background:
    * def LocalDate = Java.type('java.time.LocalDate')
    * def DateTimeFormatter = Java.type('java.time.format.DateTimeFormatter')
    * def isoDate = DateTimeFormatter.ofPattern('yyyy-MM-dd')
    * def randomOffset = 30 + Math.floor(Math.random() * 300)
    * def checkin = LocalDate.now().plusDays(randomOffset).format(isoDate)
    * def checkout = LocalDate.now().plusDays(randomOffset + 1).format(isoDate)

  Scenario: Create a new booking for a valid room
    Given url baseUrl
    And path 'api', 'room'
    When method get
    Then status 200
    And match response contains { rooms: '#[]' }
    * assert response.rooms.length > 0
    * def validRoom = response.rooms[0]
    * def roomId = validRoom.roomid
    * match roomId == '#number'

    * def bookingPayload =
    """
    {
      roomid: #(roomId),
      firstname: 'James',
      lastname: 'test',
      depositpaid: false,
      email: 'test@gmail.com',
      phone: '12345679012',
      bookingdates: {
        checkin: '#(checkin)',
        checkout: '#(checkout)'
      }
    }
    """
    Given url baseUrl
    And path 'api', 'booking'
    And header accept = 'application/json'
    And header Content-Type = 'application/json'
    And request bookingPayload
    When method post
    Then status 201
    And match response contains { bookingid: '#number' }
    And match response contains
    """
    {
      bookingid: '#number',
      roomid: #(roomId),
      firstname: 'James',
      lastname: 'test',
      depositpaid: false,
      bookingdates: {
        checkin: '#(checkin)',
        checkout: '#(checkout)'
      }
    }
    """

  @known-bug @ignore
  Scenario: Reject booking creation for a room that does not exist
    * def invalidCheckin = LocalDate.now().plusYears(2).plusDays(10).format(isoDate)
    * def invalidCheckout = LocalDate.now().plusYears(2).plusDays(11).format(isoDate)
    * def bookingPayload =
    """
    {
      roomid: 999999,
      firstname: 'Invalid',
      lastname: 'Room',
      depositpaid: false,
      email: 'invalid.room@example.com',
      phone: '12345678901',
      bookingdates: {
        checkin: '#(invalidCheckin)',
        checkout: '#(invalidCheckout)'
      }
    }
    """

    Given url baseUrl
    And path 'api', 'booking'
    And header accept = 'application/json'
    And header Content-Type = 'application/json'
    And request bookingPayload
    When method post
    Then status 404
    And match response contains { error: '#string' }

