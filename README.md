# Cognifyz Frontend Experience

## EmailJS configuration

The contact form uses the official browser SDK from EmailJS. No message is reported as sent until `emailjs.send()` resolves successfully. The frontend contains no private key or account secret.

### 1. Create the EmailJS resources

1. Create or sign in to an EmailJS account at https://www.emailjs.com/.
2. Under **Email Services**, add a service (Gmail is suitable for this project) and connect the Gmail account that may receive website messages. Copy its **Service ID**.
3. Under **Account > Public Key**, copy the **Public Key**. Do not copy or place the **Private Key** anywhere in this project.
4. Under **Email Templates**, create a template and copy its **Template ID**.

### 2. Set the recipient and template fields

Set the template **To Email** to:

```text
jasmineflora2006@gmail.com
```

The recipient can also be set using the template variable `{{recipient_email}}`. Configure this project sends that address as `recipient_email`, but the dashboard's fixed recipient is clearer for delivery.

Set the template **Reply-To** field to `{{reply_to}}`. Use these exact variables in the template body:

```text
Name: {{from_name}}
Email: {{reply_to}}
Subject: {{subject}}

{{message}}
```

### 3. Add the browser-safe values

Open `emailjs-config.js` and replace only the three placeholders:

```js
publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
serviceId: "YOUR_EMAILJS_SERVICE_ID",
templateId: "YOUR_EMAILJS_TEMPLATE_ID",
recipientEmail: "jasmineflora2006@gmail.com"
```

### 4. Test

1. Start the static site with `python -m http.server 8000` from this folder.
2. Open `http://localhost:8000`.
3. Submit the contact form once with valid information.
4. Confirm the page shows success only after the service accepts the request.
5. Check `jasmineflora2006@gmail.com` and its spam folder for the template email. Reply-To should be the sender's address.

Actual delivery is not enabled until the dashboard values are configured and a real test message reaches the mailbox. Until then, the site intentionally reports a configuration notice rather than a false success.

## API section

The API section fetches and parses `https://jsonplaceholder.typicode.com/posts`, renders selected posts as styled cards, supports title/body search and Load More, and provides loading, empty, and retry states. The raw response is never rendered directly.
