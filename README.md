# cogni.fyz — Where Data Meets Intelligence

<p align="center">
  <a href="https://cognifyz-blush.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE_DEMO-Visit_Website-222923?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/jasminefloraa/COGNIFYZ">
    <img src="https://img.shields.io/badge/GITHUB-Source_Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
</p>

<p align="center">
  <strong>A thoughtful frontend experience where design, interaction, and dynamic data come together.</strong>
</p>

---

## Overview

**cogni.fyz** is an interactive frontend web experience developed as an independent demonstration for the Cognifyz Technologies Front-End Development Internship.

The project explores how a well-structured interface can become more engaging through responsive layouts, purposeful animations, interactive components, live API integration, and functional form handling.

Rather than presenting information as a static webpage, cogni.fyz focuses on creating an experience that responds to user interaction.

## Live Preview

**Explore the deployed application:**

[https://cognifyz-blush.vercel.app/](https://cognifyz-blush.vercel.app/)

---

## Features

### 1. Interactive Landing Experience
- Modern hero section with an animated visual network.
- Interactive HTML, CSS, JavaScript, and Data nodes.
- Floating elements with subtle parallax movement.
- Scroll progress indicator and animated section reveals.
- Smooth navigation between sections.

### 2. Responsive Design
- Responsive layouts for desktop, tablet, and mobile.
- Mobile navigation menu.
- Fluid typography and flexible layouts.
- Carefully designed visual hierarchy.

### 3. Light and Dark Themes
- Interactive theme switching.
- Theme preference saved using browser Local Storage.
- Coordinated colors and components across both themes.
- Smooth theme transition effects.

### 4. Interactive Experience Section
- Three interactive preview modes:
  - Focus
  - Flow
  - Quiet
- Dynamic content updates based on user selection.
- Reset functionality to restore the default preview.

### 5. Live API Integration
- Fetches public sample data from JSONPlaceholder.
- Dynamically renders API responses as styled cards.
- Search functionality across post titles and descriptions.
- Load More functionality with incremental rendering.
- Loading, empty, and error states.
- Retry functionality when the API is unavailable.

**API Endpoint:**
`https://jsonplaceholder.typicode.com/posts`

### 6. Functional Contact Form
- Integrated with EmailJS Browser SDK.
- Collects name, email, subject, and message.
- Client-side input validation.
- Email format validation.
- Loading, success, and error feedback.
- Prevents duplicate submissions while a request is processing.
- Sends messages to the configured recipient.

### 7. Additional Interactions
- Animated visual elements.
- Interactive content cards.
- Keyboard-triggered Easter egg.
- Accessibility-conscious navigation and controls.
- Reduced-motion support.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure and content |
| CSS3 | Styling, animations, layouts, responsiveness |
| JavaScript (ES6+) | Dynamic interactions and application logic |
| JSONPlaceholder API | Public sample data |
| EmailJS | Contact form email integration |
| Local Storage | Persistent theme preference |
| Vercel | Hosting and deployment |
| Git & GitHub | Version control and source management |

### External Resources
- Google Fonts — DM Sans, Manrope, DM Mono
- EmailJS Browser SDK v4
- JSONPlaceholder REST API

---

## Project Structure

```text
COGNIFYZ/
│
├── assets/
│   └── images/
│       └── ...
│
├── index.html
├── styles.css
├── script.js
├── emailjs-config.js
├── .gitignore
└── README.md
```

| File | Description |
|---|---|
| `index.html` | Main application structure |
| `styles.css` | Responsive styling, themes and animations |
| `script.js` | Interactions, API integration and form logic |
| `emailjs-config.js` | Browser-safe EmailJS configuration |
| `assets/images/` | Project visual assets |
| `.gitignore` | Git exclusion rules |
| `README.md` | Project documentation |

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- A modern web browser.
- Python installed (for the local development server).
- An internet connection for external fonts, API data, and EmailJS.

### 1. Clone the Repository

```bash
git clone https://github.com/jasminefloraa/COGNIFYZ.git
```

### 2. Navigate to the Project

```bash
cd COGNIFYZ
```

### 3. Configure EmailJS

Create an account at [EmailJS](https://www.emailjs.com/).

Configure the following resources:

1. Create an Email Service and connect your receiving email account.
2. Create an Email Template.
3. Obtain your EmailJS Public Key.

Open `emailjs-config.js` and configure:

```javascript
window.COGNIFYZ_EMAIL_CONFIG = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  templateId: "YOUR_EMAILJS_TEMPLATE_ID",
  recipientEmail: "YOUR_RECIPIENT_EMAIL"
};
```

Configure the EmailJS template with these exact variables:

```text
Name: {{from_name}}
Email: {{reply_to}}
Subject: {{subject}}

{{message}}
```

Set the template's Reply-To field to `{{reply_to}}` and configure the intended recipient in the EmailJS dashboard.

**Security note:** The Public Key, Service ID, and Template ID are browser-facing configuration values. Never expose an EmailJS Private Key, account password, or other secret in frontend code.

For production, configure the EmailJS allowed-origin settings for your deployed domain.

### 4. Run Locally

Start a local development server:

```bash
python -m http.server 8000
```

Open your browser:

```text
http://localhost:8000
```

The application is a static frontend and does not require a Node.js backend or a build process.

---

## API Integration

The Live Data section uses the JSONPlaceholder public API.

**Request:**

```javascript
fetch("https://jsonplaceholder.typicode.com/posts")
```

The application:
- Retrieves post data asynchronously.
- Validates the response structure.
- Displays results dynamically.
- Supports searching and incremental loading.
- Handles loading and failed-request states.

API-provided text is inserted using safe DOM text operations rather than being interpreted as HTML.

---

## EmailJS Integration

The contact form uses the EmailJS Browser SDK to submit messages directly from the frontend.

**Submission flow:**

```text
User fills contact form
          |
          v
Input validation
          |
          v
EmailJS configuration check
          |
          v
EmailJS send request
          |
          v
Success / Error feedback
```

A successful EmailJS response confirms that the service accepted the request. Actual inbox delivery should be verified separately.

---

## Deployment

The project is deployed using **Vercel** and connected to the GitHub repository.

| Detail | Information |
|---|---|
| Hosting Platform | Vercel |
| Repository | GitHub |
| Branch | main |
| Live Website | https://cognifyz-blush.vercel.app/ |
| Application Type | Static Frontend |

### Deployment Workflow

```text
Local Development
       |
       v
Git Commit
       |
       v
GitHub Repository
       |
       v
Vercel Deployment
       |
       v
Live Website
```

Future commits pushed to the connected deployment branch can trigger automatic Vercel deployments.

---

## Learning Outcomes

This project provided practical experience in:

- Building semantic and accessible web interfaces.
- Designing responsive layouts using CSS.
- Implementing JavaScript-driven interactions.
- Working with asynchronous API requests.
- Handling API loading and error states.
- Integrating third-party services using EmailJS.
- Validating user input and managing form states.
- Using Local Storage for persistent preferences.
- Managing source code with Git and GitHub.
- Deploying a static frontend application with Vercel.

---

## Future Improvements

- Add more API data sources and filtering options.
- Introduce additional interactive visualizations.
- Improve automated accessibility testing.
- Add enhanced form spam protection.
- Expand the data explorer with more advanced controls.

---

## Acknowledgements

- [Cognifyz Technologies](https://cognifyz.com/) — Internship learning context.
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — Public sample REST API.
- [EmailJS](https://www.emailjs.com/) — Browser-based email integration.
- [Vercel](https://vercel.com/) — Deployment and hosting.

---

## Author

**Jasmine Flora J**

Computer Science Engineering Student | Aspiring Software Developer

- GitHub: [@jasminefloraa](https://github.com/jasminefloraa)
- LinkedIn: [jasmine-flora](https://www.linkedin.com/in/jasmine-flora/)
- Portfolio: [Visit Portfolio](https://github.com/jasminefloraa/jasmine-flora-portfolio)

---

## Project Note

This is an independent frontend development demonstration created in the context of the Cognifyz Technologies Front-End Development Internship. It is a personal learning project and is not an official product or platform of Cognifyz Technologies.

---

<p align="center">
  <strong>Built with curiosity, thoughtful design, and code.</strong>
  <br/>
  <sub>cogni.fyz — Where Data Meets Intelligence</sub>
</p>
