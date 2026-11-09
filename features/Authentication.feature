@auth @owner:amol @feature:Authentication
Feature: Authentication
  As a registered customer
  I want to log in and log out
  So that only I can reach my account and my orders

  @smoke @P0 @story:AUTH-01
  Scenario: Valid user logs in successfully
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the inventory page is displayed

  @regression @P1 @story:AUTH-02
  Scenario Outline: Invalid login shows a clear error
    Given the user is on the login page
    When the user logs in as "<username>" with password "<password>"
    Then the error message contains "<message>"

    Examples:
      | case              | username        | password     | message              |
      | locked account    | locked_out_user | secret_sauce | locked out           |
      | wrong password    | standard_user   | wrong_pass   | do not match         |
      | empty credentials |                 |              | Username is required |

  @regression @P2 @story:AUTH-03
  Scenario: User logs out
    Given the user is logged in
    When the user logs out
    Then the login page is displayed

  @regression @P0 @story:AUTH-04
  Scenario: A protected page needs a login
    When the user opens the inventory page directly
    Then the error message contains "when you are logged in"
    And the login page is displayed

  @regression @P2 @story:AUTH-05
  Scenario: The session survives a page refresh
    Given the user is logged in
    When the user refreshes the page
    Then the inventory page is displayed
