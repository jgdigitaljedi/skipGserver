## Skipg.me backend application ##

This is the backend for skipg.me. It's simple and I started the repo based off of an example I found at: [https://www.sitepoint.com/user-authentication-mean-stack/](https://www.sitepoint.com/user-authentication-mean-stack/).

### Main Dependencies ###
- express
- express-jwt
- passport
- passport-local
- mongoose
- jsonwebtoken
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
### Get Started ###
```
git clone https://github.com/jgdigitaljedi/skipGserver
npm i
npm run dev
```