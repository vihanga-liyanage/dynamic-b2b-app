# Asgardeo B2B Showcase

A React application that showcases B2B features of WSO2 Asgardeo IAM product. This app uses Asgardeo's React SDK for authentication and demonstrates how to create a configurable B2B application that can be easily adapted to different industries.

## Features

- **Dynamic Configuration**: All user-facing interfaces are controlled by a single configuration file, making it easy to adapt the app to different industries.
- **Asgardeo Authentication**: Secure authentication using Asgardeo's React SDK.
- **Organization Branding**: Automatically applies the organization's primary color from Asgardeo's Branding API.
- **Scope-Based Access Control**: Menu items are dynamically displayed based on the scopes returned in the OAuth2 token.
- **Responsive Dashboard**: A modern, responsive dashboard with configurable widgets.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- An Asgardeo account with an organization and application set up

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/asgardeo-b2b-showcase.git
   cd asgardeo-b2b-showcase
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Asgardeo:
   - Create an application in Asgardeo
   - Configure the redirect URLs to point to your application (e.g., http://localhost:3000)
   - Note the client ID

4. Update the `.env` file with your Asgardeo configuration:
   ```
   REACT_APP_ASGARDEO_CLIENT_ID=your-client-id
   REACT_APP_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your-org
   REACT_APP_ASGARDEO_RESOURCE_SERVER=https://api.asgardeo.io
   ```

5. Start the development server:
   ```
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

The application's user interface is controlled by configuration files located in the `src/config` directory:

- `config.json`: Base configuration with default settings
- `healthcare.json`: Healthcare industry-specific configuration

You can create additional industry-specific configurations by following the same structure.

### Configuration Structure

```json
{
  "appName": "Application Name",
  "theme": {
    "primaryColor": "#1976d2",
    "secondaryColor": "#dc004e",
    "backgroundColor": "#f5f5f5",
    "textColor": "#333333"
  },
  "logo": {
    "main": "/logo.png",
    "small": "/logo-small.png"
  },
  "menuItems": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "icon": "Dashboard",
      "path": "/dashboard",
      "requiredScope": "dashboard:view"
    },
    ...
  ],
  "dashboardWidgets": [
    {
      "id": "widgetId",
      "title": "Widget Title",
      "type": "counter",
      "requiredScope": "scope:view",
      "data": { ... }
    },
    ...
  ],
  "texts": {
    "welcomeMessage": "Welcome message",
    "dashboardTitle": "Dashboard title",
    "loginTitle": "Login page title"
  }
}
```

## Asgardeo Integration

This application integrates with Asgardeo using the following features:

1. **Authentication**: Uses Asgardeo's React SDK for secure authentication.
2. **Scope-Based Access Control**: Menu items are displayed based on the scopes in the OAuth2 token.
3. **Organization Branding**: Fetches and applies the organization's primary color from Asgardeo's Branding API.

## Customizing for Different Industries

To customize the application for a different industry:

1. Create a new configuration file in `src/config` (e.g., `insurance.json`).
2. Update the configuration with industry-specific settings.
3. Modify the `ConfigProvider` in `src/contexts/ConfigContext.tsx` to include your new industry.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
