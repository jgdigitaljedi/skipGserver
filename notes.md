## ** Insert admin user **
- first run in dev mode and hit the devuser route to get the hash and salt for your admin login
```
mongo
use skipg
db.users.insert({email:'admin@admin.com', firstName: 'Admin', lastName: 'McAdmin', joinedDate: '', lastUpdated: '', admin: true, salt: 'yourGeneratedSalt', 'hash': 'yourGeneratedHash'})
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

