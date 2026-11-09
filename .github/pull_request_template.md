## What changed and why

<!-- One or two sentences. Link the ticket or story ID. -->

## Checklist

- [ ] Scenarios are in business language and cover one behaviour each
- [ ] Each scenario has a suite tag, a priority tag (`@P0` to `@P4`) and a `@story:` ID
- [ ] Existing steps were reused where possible
- [ ] Locators follow the order in `docs/CODING_STANDARDS.md` (role, label, placeholder, text, test id)
- [ ] No hard waits, no secrets, no dependency on another scenario
- [ ] Passed three times in a row locally
- [ ] `npm run verify` is clean
- [ ] Docs updated if behaviour or structure changed (`docs/TRACEABILITY.md`, `CHANGELOG.md`)
