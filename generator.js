const crypto = require('crypto');
const fs = require('fs')
const exec = require('child_process').exec;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Enter the length of the password (only numbers):');
readline.question('', (num) => {
    console.log('Do you want to include special characters? (y/n)');
    readline.question('', (specialChars) => {
        console.log('Do you want to include numbers? (y/n)');
        readline.question('', (numbers) => {
            console.log('Enter the usage for this password:');
            readline.question('', (usage) => {
                password(num, specialChars, numbers, usage);
                readline.close();
            });
        });
    });
});

const password = (num, specialChars, numbers, usage) => {
    function generateRandomPassword(length, useSpecialChars, useNumbers) {
        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useSpecialChars === 'y') {
            charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        }
        if (useNumbers === 'y') {
            charset += '0123456789';
        }
        let password = '';
        for (let i = 0; i < length; i++) {
            const index = crypto.randomInt(0, charset.length);
            password += charset[index];
        }
        return password;
    }
    
    const password = generateRandomPassword(num, specialChars, numbers);
    console.log(password);
    console.log('You can now copy your password. It is also saved in the file named password.txt');
    fs.appendFile('password.txt', `usage: ${usage} password: ${password}\nmade on: ${new Date()}\n\n`, (err) => {
        if (err) throw err;
        console.log('error')
        console.log(err)
    });
    setTimeout(() => {
        console.log('Opening password.txt')
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
