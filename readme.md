## Skipg.me backend application ##

This is the backend for my [skipg.me](https://skipg.me) site. I started the repo based off of an example I found at: [https://www.sitepoint.com/user-authentication-mean-stack/](https://www.sitepoint.com/user-authentication-mean-stack/).

Note that this backend is not yet deployed as my first iteration of the website was meant to be done quickly so I used cloudinary for photo uploads and storage and have no user creation or login at the moment. This backend is meant to make the application richer once it is integrated.

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
### Initial setup ###
```
git clone https://github.com/jgdigitaljedi/skipGserver
npm i
```
---
### Seed MongoDB ###
```
npm run seed
```
---
### Run dev server ###
```
git clone https://github.com/jgdigitaljedi/skipGserver
npm i
npm run dev
```
---
### Run lint ###
Linting done with eslint
```
npm run lint
```
---
### Run lint & tests ###
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