# it-helpdesk-web-forms

A small HTML, CSS and JavaScript help desk ticket-intake form. It validates input, suggests a priority from impact and urgency, blocks passwords in free text, and builds a clean ticket you can copy or open in your email app. **There is no backend, no API key and no secret** anywhere in this project.

**Roles this supports:** Information Systems Technician (HTML/JavaScript basics), Service Desk Analyst, Help Desk Specialist, Technical Support Specialist.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Accessible form markup with labels and live regions |
| `src/ticket.js` | Pure logic: validation, priority matrix, ticket text, mailto link |
| `src/app.js` | DOM wiring only |
| `src/style.css` | Styling and focus states |
| `tests/ticket.test.js` | Tests using Node's built-in test runner |

## Test

Requires Node 18 or newer. No packages to install.

```bash
npm test
```

## Troubleshooting notes (web basics)

- Button does nothing: open the browser console and look for JavaScript errors or a mistyped element ID.
- Field not validating: check that the input `name` attribute matches the key used in `validate()`.
- Layout broken on a phone: check the `viewport` meta tag and the media query in `style.css`.

## Design notes

- Priority follows an impact and urgency matrix (P1 to P4).
- The "Open in email app" button uses a `mailto:` link to the placeholder address `helpdesk@example.com`. Change `DEMO_ADDRESS` in `src/app.js` to use your own mailbox. The form never sends mail by itself.
- To connect it to a real ticketing system you would post to that system's API from a server, keeping credentials on the server.

## License

MIT. See [LICENSE](LICENSE).
