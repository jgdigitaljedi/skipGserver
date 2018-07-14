## Skipg.me backend application ##

This is the backend for my [skipg.me](https://skipg.me) site. It's simple and I started the repo based off of an example I found at: [https://www.sitepoint.com/user-authentication-mean-stack/](https://www.sitepoint.com/user-authentication-mean-stack/).

### Main Dependencies ###
- [express](https://github.com/expressjs/express)
- [passport](https://github.com/jaredhanson/passport)
- [mongoose](https://github.com/Automattic/mongoose)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [multer](https://github.com/expressjs/multer)
- [sharp](https://github.com/lovell/sharp)

---
### System Dependencies ###
I used node to invoke a child process that uses exiftool to remove geo tag data from photos on upload.

Linux Install:
```
sudo apt-get install libimage-exiftool-perl
```

Mac install:
```
brew install exiftool
```
---
### Run dev server ###
```
git clone https://github.com/jgdigitaljedi/skipGserver
npm i
npm run dev
```
---
### Run tests ###
Testing is done using [Frisby](https://github.com/vlucas/frisby) and [Jest](https://jestjs.io/).
```
npm run test
```
---
### Generate API docs ###
API documentation generated with [apiDoc](https://github.com/apidoc/apidoc)
```
npm run docs
```