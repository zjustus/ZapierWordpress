# Zapier RTB wordpress integration
This Zapier integration with wordpress was developed for Reasons to Believe but it can be used by any wordpress
unlike the stock integration this integration can get and add posts to any post type!

Before the first test, run:
```bash
export baseURL={baseURL} loginURL={loginURL} username={username} password={password}
```
- baseURL EX: https://wordpress.org
- loginURL EX: wp-login.php
- username EX: jdoe@wordpress.org
- password EX: qwerty123

```bash
# Install dependencies
npm install  # or you can use yarn

# Run tests
zapier test

# Register the integration on Zapier if you haven't
zapier register "App Title"

# Or you can link to an existing integration on Zapier
zapier link

# Push it to Zapier
zapier push
```

Find out more on the latest docs: https://github.com/zapier/zapier-platform/blob/master/packages/cli/README.md.
