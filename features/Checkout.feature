@checkout @owner:amol @feature:Checkout
Feature: Checkout
  As a customer
  I want to complete my purchase
  So that the order is placed and I get a confirmation

  Background:
    Given the user is logged in

  @regression @P0 @story:CHK-01
  Scenario: Complete an order
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user checks out with first name "Test", last name "User" and postal code "12345"
    Then the order confirmation says "Thank you for your order!"

  @regression @P1 @story:CHK-02
  Scenario: Checkout asks for the customer details
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user continues checkout without entering details
    Then the checkout error contains "First Name is required"

  @regression @P1 @story:CHK-03
  Scenario Outline: Checkout needs every customer detail
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user enters checkout details with first name "<first>", last name "<last>" and postal code "<postal>"
    Then the checkout error contains "<message>"

    Examples:
      | case               | first | last | postal | message                 |
      | missing first name |       | User | 12345  | First Name is required  |
      | missing last name  | Test  |      | 12345  | Last Name is required   |
      | missing postal code| Test  | User |        | Postal Code is required |

  @regression @P2 @story:CHK-04
  Scenario: The customer can cancel checkout and return to the cart
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user starts checkout
    And the user cancels the checkout
    Then the cart contains "Sauce Labs Backpack"

  @regression @P1 @story:CHK-05
  Scenario: The order overview shows the item total
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    And the user opens the cart
    And the user enters checkout details with first name "Test", last name "User" and postal code "12345"
    Then the order overview shows "Item total: $39.98"
