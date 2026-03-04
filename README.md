# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

🚀 What’s Included

🔐 Authentication System (JWT-Simulated)

A complete front-end authentication flow designed to simulate real-world JWT behavior.

| Feature             | Description                                |
| ------------------- | ------------------------------------------ |
| Login Validation    | Credential-based login screen              |
| JWT Simulation      | Token generated on successful login        |
| Storage             | Token stored in `localStorage`             |
| Expiry Handling     | Automatic token expiration check           |
| Session Persistence | User remains logged in until token expires |


Features:

  Secure login screen with credential validation
  
  Simulated JWT token generation upon successful login
  
  Token stored in localStorage
  
  Automatic token expiry validation
  
  Session persistence until expiration

Demo Accounts:

| Role    | Email                                           | Password |
| ------- | ----------------------------------------------- | -------- |
| Plant   | [plant@pharma.com](mailto:plant@pharma.com)     | role123  |
| Manager | [manager@pharma.com](mailto:manager@pharma.com) | role123  |
| Head    | [head@pharma.com](mailto:head@pharma.com)       | role123  |
| Admin   | [admin@pharma.com](mailto:admin@pharma.com)     | role123  |


Granular access permissions ensure users only see what they’re authorized to access.

Role	Access Level
| Role    | Dashboard Access        | Analytics | Maintenance    | Admin Panel |
| ------- | ----------------------- | --------- | -------------- | ----------- |
| Plant   | Own plant machines only | ❌         | Own plant only | ❌           |
| Manager | All machines            | ✅         | ✅              | ❌           |
| Head    | Full dashboard          | ✅         | ✅              | ❌           |
| Admin   | Everything              | ✅         | ✅              | ✅           |

Plant	Access to machines and maintenance data for their assigned plant only
Manager	Access to all machines + production analytics
Head	Full dashboard access across all plants
Admin	Complete system access including Admin Panel

Permissions are enforced at route, component, and data levels.

📡 Real-Time Machine Metrics
| Feature           | Details                                        |
| ----------------- | ---------------------------------------------- |
| Update Interval   | Every 3 seconds                                |
| Equipment         | 6 centrifuges across 3 plants                  |
| Metrics           | RPM, Temperature, Vibration, Power, Efficiency |
| Status Indicators | Running / Idle / Warning                       |
| Detail View       | SVG gauges + 24h sparkline trends              |
| Alerts            | Animated warning indicators                    |

| Feature              | Description                         |
| -------------------- | ----------------------------------- |
| Alert Acknowledgment | Warning confirmation workflow       |
| Maintenance Schedule | Planned service tracking table      |
| MTBF                 | Mean Time Between Failures tracking |
| MTTR                 | Mean Time To Repair tracking        |
| Downtime Monitoring  | Active system alerts                |


Status indicators:

🟢 Running

⚪ Idle

🟠 Warning (with animated alerts)

📊 Production Analytics (Manager & Head Roles Only)


Advanced visualization tools for production oversight.

Includes:

Hourly throughput charts

Plant efficiency comparison

Product distribution breakdown

Cross-plant performance insights

Designed for operational decision-making and strategic planning.

🔧 Maintenance Center

Centralized maintenance management and monitoring system.

Capabilities:

Alert acknowledgment workflow

Maintenance scheduling table

MTBF (Mean Time Between Failures) tracking

MTTR (Mean Time To Repair) tracking

Active warning monitoring

Helps reduce downtime and optimize equipment lifecycle.

🛡️ Admin Panel (Admin Only)

Full system-level control interface.

Features:

User management

Role assignment
| Feature          | Description                  |
| ---------------- | ---------------------------- |
| User Management  | Create, update, remove users |
| Role Assignment  | Modify user permissions      |
| Machine Registry | Add/edit equipment           |
| System Health    | Platform status overview     |
| Audit Logs       | Activity tracking & logging  |


Machine registry management

System health overview

Audit logs & activity tracking
| Feature              | Description                         |
| -------------------- | ----------------------------------- |
| Alert Acknowledgment | Warning confirmation workflow       |
| Maintenance Schedule | Planned service tracking table      |
| MTBF                 | Mean Time Between Failures tracking |
| MTTR                 | Mean Time To Repair tracking        |
| Downtime Monitoring  | Active system alerts                |


Designed for platform governance and operational control.

🎨 UI & Design System
| Element        | Details                                    |
| -------------- | ------------------------------------------ |
| Theme          | Dark Industrial                            |
| Typography     | Exo 2 + Share Tech Mono                    |
| Color Palette  | Deep Navy / Cyan                           |
| Visual Effects | Glowing indicators + animated live feed    |
| Layout         | High-contrast control-room style dashboard |


A modern dark industrial theme optimized for control room environments.


🏭 System Overview

This platform simulates a pharmaceutical manufacturing monitoring system featuring:

Secure authentication

Multi-role authorization

Real-time telemetry

Analytics & reporting

Maintenance lifecycle management

Administrative governance

Built to demonstrate enterprise-grade dashboard architecture with clean UI, scalable role logic, and real-time simulation.
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
