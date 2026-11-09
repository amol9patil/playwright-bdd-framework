@inventory @owner:amol @feature:Inventory
Feature: Inventory
  As a customer
  I want to browse and sort the products
  So that I can find what I want to buy quickly

  Background:
    Given the user is logged in

  @smoke @P1 @story:INV-01
  Scenario: Product list is displayed
    Then the inventory shows 6 products

  @regression @P2 @story:INV-02
  Scenario: Products can be sorted by price low to high
    When the user sorts products by "Price (low to high)"
    Then the first product is "Sauce Labs Onesie"

  @regression @P2 @story:INV-03
  Scenario: Products can be sorted by name Z to A
    When the user sorts products by "Name (Z to A)"
    Then the first product is "Test.allTheThings() T-Shirt (Red)"

  @regression @P2 @story:INV-04
  Scenario: Products can be sorted by price high to low
    When the user sorts products by "Price (high to low)"
    Then the first product is "Sauce Labs Fleece Jacket"
