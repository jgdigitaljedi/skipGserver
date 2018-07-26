## ** Insert admin user **
- first run in dev mode and hit the devuser route to get the hash and salt for your admin login
```
mongo
use skipg
db.users.insert({email:'admin@admin.com', firstName: 'Admin', lastName: 'McAdmin', joinedDate: 'MM/DD/YYYY hh:mm a', lastUpdated: 'MM/DD/YYYY hh:mm a', active: true, admin: true, salt: 'yourGeneratedSalt', 'hash': 'yourGeneratedHash'})
```

## ** Drop DB **
```
mongo
use skipg
db.dropDatabase()
```

## ** Install exiftool on server **
Ubuntu or Linux distro with apt
```
sudo apt-get install libimage-exiftool-perl
```

Mac
```
brew install exiftool
```

## Env vars ##
- SPARKPOST_API_KEY
- NODE_ENV
- MYEMAIL
- SKIPGSECRET

## TODOs ##
- changes all responses to have {error: true/false, whatever: whatever} format
- more API tests
- write unit tests for logic
- update doc generation blocks
- update POSTMAN file
- explore http2 possibility
- rate limit on register, reset password, forgot password, and login
- explore multi photo upload
- look into use cases for indexing
- look into more security focused options
- maybe make a docker container for this backend app for simpler frontend dev

