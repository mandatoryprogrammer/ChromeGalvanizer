# ![icon](./src/assets/img/cg-small-icon.png) Chrome Galvanizer

## Summary

Chrome Galvanizer is a tool to generate Chrome enterprise policies to help users harden their browser security. Currently, the main support is for generating policies to restrict extension access from sites explicitly marked as sensitive (e.g. your email, bank, cryptocurency, and other sites). This allows you to prevent extensions from accessing these specific sites even if you've already granted them permission to do so when first installing them.

## What does this protect against?

This protects from hijacked extensions with backdoored updates and against extensions that have been [exploited due to a security vulnerability in their code](https://thehackerblog.com/reading-your-emails-with-a-readwrite-chrome-extension-same-origin-policy-bypass-8-million-users-affected/).

One good example of the former type of attack this protects against is the case of the [MEGA Chrome extension getting hacked](https://mega.nz/blog_47). Basically, the account which publishes the MEGA extension likely was phished, the result being that a backdoored extension update was pushed out to all extension users (millions). Per MEGA's statement the extension keylogged and stole *“credentials for sites including amazon.com, live.com, github.com, google.com (for webstore login), myetherwallet.com, mymonero.com, [and] idex.market.”*

Using Chrome Galvanizer, you can protect yourself from attacks like this by specifying specific sites that one or all of your extensions can no longer access. For the MEGA case, if users had created a policy restricting access for the MEGA extension to access `amazon.com`, `live.com`, `github.com`, `google.com`, `myetherwallet.com`, `mymonero.com`, and `idex.market` then they'd be protected from the attack.

You can even configure policies that only allow an extension to access a specific whitelist of sites instead of just blacklisting sensitive ones. This is useful if you have an extension you want to use for a set of sites but not the rest of the web. Of course, you can also layer these policies to get even better results.

## Tools

This is a SPA written in Vue with [`vue-cli`](https://cli.vuejs.org/).


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
