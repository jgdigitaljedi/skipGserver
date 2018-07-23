const SparkPost = require('sparkpost');
const key = process.env.SPARKPOST_API_KEY;
const client = new SparkPost(key);

module.exports.sendEmail = function (email, name, token) {
  return new Promise((resolve, reject) => {
    client.transmissions.send({
      options: {
        // sandbox: true
      },
      content: {
        from: {
          email: 'admin@mail.skipg.me',
          name: 'Test'
        },
        subject: 'Skipg.me password reset requested',
        html: `<html><body>Click on this link to reset your password: https://skipg.me/api/user/resetlink/${token}</body></html>`
      },
      recipients: [
        {
          address: {
            email: 'digitaljedi@outlook.com',
            name: 'Joey'
          }
        },
        // {
        //   address: {
        //     name: `${name.first} ${name.last}`,
        //     email: email
        //   }
        // }
      ]
    })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.error('ERROR SENDING EMAIL!');
        reject(err);
      });
  });
};