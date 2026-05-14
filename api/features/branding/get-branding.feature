Feature: Branding verification

  Background:
    * def emailRegex = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
    

  Scenario: Validate the branding response contract and data types
    Given url baseUrl
    And path 'api', 'branding'
    When method get
    Then status 200
    And match response ==
    """
    {
      name: 'Shady Meadows B&B',
      logoUrl: '#string',
      description: '#string',
      directions: '#string',
      contact: {
        name: 'Shady Meadows B&B',
        phone: '#string',
        email: '#regex ' + emailRegex
      },
      address: {
        line1: '#string',
        line2: '#string',
        postTown: '#string',
        county: '#string',
        postCode: '#string'
      },
      map: {
        latitude: '#number',
        longitude: '#number'
      }
    }
    """