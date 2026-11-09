# Requirement Traceability

Every scenario is tagged with a requirement ID (`@story:AUTH-01` and so on), so you can go from a
requirement to the checks that cover it, and back. The IDs below are illustrative, since the demo
application has no real backlog. On a client project I'd use the real Jira or Azure DevOps item numbers.

| Story ID | Requirement                                                                           | Feature        | Scenarios | Priority | Suite      |
| -------- | ------------------------------------------------------------------------------------- | -------------- | --------- | -------- | ---------- |
| AUTH-01  | A valid user can log in                                                               | Authentication | 1         | P0       | Smoke      |
| AUTH-02  | An invalid login shows a clear error (wrong password, locked account, empty username) | Authentication | 3         | P1       | Regression |
| AUTH-03  | A user can log out                                                                    | Authentication | 1         | P2       | Regression |
| AUTH-04  | A protected page cannot be opened without logging in                                  | Authentication | 1         | P0       | Regression |
| AUTH-05  | The session survives a page refresh                                                   | Authentication | 1         | P2       | Regression |
| INV-01   | The product list is displayed                                                         | Inventory      | 1         | P1       | Smoke      |
| INV-02   | Products can be sorted by price, low to high                                          | Inventory      | 1         | P2       | Regression |
| INV-03   | Products can be sorted by name, Z to A                                                | Inventory      | 1         | P2       | Regression |
| INV-04   | Products can be sorted by price, high to low                                          | Inventory      | 1         | P2       | Regression |
| CART-01  | A product can be added to the cart                                                    | Cart           | 1         | P0       | Smoke      |
| CART-02  | A product can be removed from the cart                                                | Cart           | 1         | P1       | Regression |
| CART-03  | The cart badge counts every product added                                             | Cart           | 1         | P1       | Regression |
| CART-04  | The cart keeps its items when the user continues shopping                             | Cart           | 1         | P1       | Regression |
| CART-05  | A product can be removed from the product list                                        | Cart           | 1         | P2       | Regression |
| CHK-01   | A customer can complete an order                                                      | Checkout       | 1         | P0       | Regression |
| CHK-02   | Checkout asks for the customer details                                                | Checkout       | 1         | P1       | Regression |
| CHK-03   | Checkout needs every customer detail (first name, last name, postal code)             | Checkout       | 3         | P1       | Regression |
| CHK-04   | The customer can cancel checkout and return to the cart                               | Checkout       | 1         | P2       | Regression |
| CHK-05   | The order overview shows the item total                                               | Checkout       | 1         | P1       | Regression |
| E2E-01   | A customer can buy two products from login to logout                                  | EndToEnd       | 1         | P0       | Regression |

**Total: 22 requirements, 34 test runs per browser.** A scenario outline counts once as a requirement but runs once per example row. Every test run happens once per browser project, so CI produces 102 results.

## How to keep it current

- Every new scenario gets a `@story:` tag and a priority tag. A scenario without them doesn't pass review.
- The reportingLabs report reads these tags, so coverage by requirement and by priority shows up in the
  Breakdown charts without any extra work.
- When a requirement changes, search the repo for its ID (`grep -r "@story:CART-02" features`) to find
  every scenario that needs a review.
