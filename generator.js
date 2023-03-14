const crypto = require('crypto');
const fs = require('fs')
const exec = require('child_process').exec;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});  

console.log('Enter the length of the password (only numbers):');
readline.question('', (num) => {
  console.log('Enter the usage for this password:');
  readline.question('', (usage) => {
        password(num, usage);
        readline.close();
    });
});

const password = (num, usage) => {
    const crypto = require('crypto');

    function generateRandomPassword(length) {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
      let password = '';
      
      for (let i = 0; i < length; i++) {
        const index = crypto.randomInt(0, charset.length);
        password += charset[index];
      }
      
      return password;
    }
    
    // Example usage: generate a random password with length 12
    const password = generateRandomPassword(num);
    console.log(password);
    console.log('you can now copy your pasword you will also find it in the file named password.txt');
    fs.appendFile('password.txt', `usage: ${usage} password: ${password} made the: ${new Date()}\n\n`, (err) => {
        if (err) throw err;
      });
      setTimeout(() => {
        console.log('opening password.txt')
        exec('start password.txt', (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(stdout);
        });
      }, 3000)
    setTimeout(() => {
        process.exit()
      }, 10000)
   
}