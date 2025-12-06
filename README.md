# Playwright Trello Automation Framework

This is a training automation framework built with Playwright.
Most demo or dummy testing sites are extremely boring, so this project uses Trello to provide real-life scenarios, dynamic elements, and more interesting challenges.
No stress or load tests were performed — the goal of this project is practice, not putting any heavy pressure on infrastructure.

## Features

- **Page Object Model**: Modular and reusable page objects (`BoardPage`, `CardPage`).
- **Smart Authentication**: Reuses session cookies to skip login steps, speeding up tests.
- **Custom Fixtures**: Dependency injection for pages, API clients, and automatic test data cleanup.
- **Hybrid Testing**: Combines UI interactions with API verification and cleanup.

## Prerequisites

- Node.js (v16+)
- A Trello account

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the root directory with your Trello credentials:
   ```env
   TRELLO_EMAIL=your_email@example.com
   TRELLO_PASS=your_password
   TRELLO_KEY=your_api_key
   TRELLO_TOKEN=your_api_token
   TRELLO_BOARD_URL=https://trello.com/b/your_board_id/test-board
   TRELLO_BASE_URL=https://trello.com
   ```
   > To get API Key & Token: https://trello.com/power-ups/admin

## Running Tests

### Standard Commands

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests (headless) |
| `npx playwright test --headed` | Run tests in visible browser |
| `npx playwright test --grep "@smoke"` | Run only smoke tests |
| `npx playwright test --project=default` | Run only UI tests |
| `npx playwright test --project=api-only` | Run only API tests |

### Debugging

```bash
# Run a specific test file
npx playwright test tests/ui/board.spec.ts

# Run in debug mode with inspector
npx playwright test --debug
```

## Project Structure

```
├── src/
│   ├── api/          # API clients (TrelloAPI)
│   ├── config/       # Configuration (Auth, etc.)
│   ├── fixtures/     # Custom Playwright fixtures
│   ├── pages/        # Page Objects (BoardPage, CardPage)
│   └── utils/        # Utilities (Session management)
├── tests/
│   ├── api/          # API tests
│   ├── ui/           # UI tests
│   └── auth.setup.ts # Authentication setup
├── auth.json         # Stored session state (git-ignored)
└── playwright.config.ts
```

## Test Data Management

The framework uses a **clean-up-as-you-go** strategy.
- **UI Tests**: Created cards are registered in the `cardCleanup` fixture and automatically deleted via API after the test finishes.
- **API Tests**: Resources are created and deleted within the test lifecycle or fixtures.

## Troubleshooting

### Authentication Issues
If tests fail with login errors or session invalidity:
1. Delete the `auth.json` file:
   ```bash
   rm auth.json
   ```
2. Run tests again - a new session will be created automatically.

### Flaky Tests
If UI tests are flaky:
- Ensure you are running with `npx playwright test --project=default` (runs serially).
- Check if Trello UI has changed (selectors might need updates).

