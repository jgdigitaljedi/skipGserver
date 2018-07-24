const SparkPost = require('sparkpost');
const key = process.env.SPARKPOST_API_KEY;
const client = new SparkPost(key);
const chalk = require('chalk');

module.exports.sendEmail = function (email, name, token) {
  return new Promise((resolve, reject) => {
    let recipient;
    if (process.env.NODE_ENV === 'production') {
      recipient = {
        address: {
          name: `${name.first} ${name.last}`,
          email: email
        }
      };
    } else {
      recipient = {
        address: {
          name: 'Joey G',
          email: process.env.MYEMAIL
        }
      };
    }
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
        recipient
      ]
    })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(chalk.red('ERROR SENDING EMAIL!'));
        reject(err);
      });
  });
};