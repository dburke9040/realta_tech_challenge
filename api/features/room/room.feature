Feature: Room API

  Scenario: Retrieve the list of available rooms
    Given url baseUrl
    And path 'api', 'room'
    When method get
    Then status 200
    And match response contains { rooms: '#[]' }
    And match each response.rooms contains
    """
    {
      roomid: '#number',
      roomName: '#string',
      type: '#string',
      accessible: '#boolean',
      description: '#string',
      image: '#string',
      features: '#[]',
      roomPrice: '#number'
    }
    """
    * assert response.rooms.length > 0
    * def roomsWithPositivePrice = karate.filter(response.rooms, function(room){ return room.roomPrice > 0 })
    * assert roomsWithPositivePrice.length > 0

  @known-bug @ignore
  Scenario: Reject availability search when checkout is before checkin
    Given url baseUrl
    And path 'api', 'room'
    And param checkin = '2026-05-20'
    And param checkout = '2026-05-19'
    When method get
    Then status 400
    And match response contains { error: '#string' }

