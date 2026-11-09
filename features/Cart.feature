@cart @owner:amol @feature:Cart
Feature: Shopping cart
  As a customer
  I want to add and remove products in my cart
  So that I only pay for what I actually want

  Background:
    Given the user is logged in

  @smoke @P0 @story:CART-01
  Scenario: Add a product to the cart
    When the user adds "Sauce Labs Backpack" to the cart
    Then the cart badge shows 1

  @regression @P1 @story:CART-02
  Scenario: Remove a product from the cart
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user removes "Sauce Labs Backpack" from the cart
    Then the cart is empty

  @regression @P1 @story:CART-03
  Scenario: The cart badge counts every product added
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    And the user adds "Sauce Labs Bolt T-Shirt" to the cart
    Then the cart badge shows 3

  @regression @P1 @story:CART-04
  Scenario: The cart keeps its items when the user continues shopping
    When the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user continues shopping
    Then the cart badge shows 1

  @regression @P2 @story:CART-05
  Scenario: A product can be removed from the product list
    When the user adds "Sauce Labs Backpack" to the cart
    And the user removes "Sauce Labs Backpack" from the product list
    Then the cart badge is not shown
