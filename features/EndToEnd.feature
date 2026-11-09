@e2e @owner:amol @feature:EndToEnd
Feature: End-to-end purchase journey
  As a customer
  I want to buy products from the moment I log in until I log out
  So that the whole journey works together, not just each screen on its own

  # This journey is longer than the other scenarios on purpose. It checks that login, cart,
  # checkout and logout work as one flow. The detail of each step is covered by the smaller scenarios.
  @regression @P0 @story:E2E-01
  Scenario: Customer buys two products from login to logout
    Given the user is on the login page
    When the user logs in with valid credentials
    And the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    Then the cart badge shows 2
    When the user opens the cart
    Then the cart contains "Sauce Labs Backpack"
    And the cart contains "Sauce Labs Bike Light"
    When the user enters checkout details with first name "Test", last name "User" and postal code "12345"
    Then the order overview shows "Item total: $39.98"
    When the user finishes the order
    Then the order confirmation says "Thank you for your order!"
    When the user returns to the product list
    Then the cart badge is not shown
    When the user logs out
    Then the login page is displayed
