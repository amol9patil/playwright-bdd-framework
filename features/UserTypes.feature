@users @owner:amol @feature:UserTypes
Feature: Account types
  As the business
  I want every kind of customer account to be able to log in and buy
  So that no group of customers is blocked from using the shop

  # Locked-out accounts are covered in Authentication.feature (AUTH-02).
  # The password is the shared one from the environment file, so it never appears here.
  @regression @P1 @story:USER-01
  Scenario Outline: Every account type can log in
    Given the user is on the login page
    When the user logs in as the "<user>" user
    Then the inventory page is displayed

    Examples:
      | case             | user                    |
      | standard user    | standard_user           |
      | slow user        | performance_glitch_user |
      | problem user     | problem_user            |
      | error user       | error_user              |
      | visual user      | visual_user             |

  # No price checks on purpose: some of these accounts are designed to look different.
  @regression @P1 @story:USER-02
  Scenario Outline: Every account type can place an order
    Given the user is on the login page
    When the user logs in as the "<user>" user
    And the user adds "Sauce Labs Backpack" to the cart
    And the user opens the cart
    And the user checks out with first name "Test", last name "User" and postal code "12345"
    Then the order confirmation says "Thank you for your order!"

    Examples: Accounts that should complete a purchase
      | case          | user                    |
      | standard user | standard_user           |
      | slow user     | performance_glitch_user |
      | visual user   | visual_user             |

    # problem_user and error_user are practice accounts with built-in defects. I keep them in the
    # suite on purpose and mark each one @fail, so the suite stays green and the defect stays
    # written down. If SauceDemo ever fixes one, the test will report an unexpected pass and the
    # @fail tag can come off. On a real project I'd add the ticket number to the comment as well.

    # problem_user: typing in the Last Name box fills First Name instead, so checkout stops with
    # "Last Name is required". The page snapshot in the report shows it. Not a test problem.
    @known-defect @fail
    Examples: problem_user defect, Last Name input overwrites First Name
      | case         | user         |
      | problem user | problem_user |

    # error_user: Finish is clicked but nothing happens. The overview stays on screen, the cart
    # badge still shows 1 and the order is never confirmed.
    @known-defect @fail
    Examples: error_user defect, Finish does not complete the order
      | case       | user       |
      | error user | error_user |
