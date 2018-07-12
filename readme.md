## Skipg.me backend application ##

This is the backend for skipg.me. It's simple and I started the repo based off of an example I found at: [https://www.sitepoint.com/user-authentication-mean-stack/](https://www.sitepoint.com/user-authentication-mean-stack/).

#### Main Dependencies ####
- express
- express-jwt
- passport
- passport-local
- mongoose
- jsonwebtoken

#### system dependencies ####
I used node to invoke a child process that uses exiftool to remove geo tag data from photos on upload. I develop primarily on a linux laptop and use linux servers. Not sure how to handle this on another OS. Here's the install line for apt:
```
sudo apt-get install libimage-exiftool-perl
```

#### steps ####
```
git clone https://github.com/jgdigitaljedi/skipGserver
npm i
npm run dev
```