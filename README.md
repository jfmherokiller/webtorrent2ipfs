# add2ipfs webapp

This is a simple webtool to add WebTorrents to an IPFS node.

## Serious Issues
- This only works on the localhost gateway because the requests are forced to run in https mode on ipfs.io which breaks them.

## Troubleshooting

- **The page is not loading! What do I do?**
  Try cloning this repository, run `npm install` or `yarn install` and use the hash you get there.

- **There is an error, nothing seems to happen.**
  Check the browser console, there may be errors. It may be a config issue (writable or CORS).

- **Config issue? Writable? CORS?**
  In order to write to ipfs, your daemon must allow the webpage to write through. It is recommended that you turn the ipfs gateway writable, and use the public gateway. If that fails, try enabling CORS for `http://localhost:8080` or whatever port you're using. See `ipfs daemon --help` on how to set HTTP Headers for CORS.


## Develop

Clone it, npm install, and edit

After Editing Run:
```sh
> npm run setup_test

```

## About

- Author: @jbenet
- Author: @jfmherokiller
- License: MIT
