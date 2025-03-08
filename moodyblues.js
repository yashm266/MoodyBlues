const fs = require('fs');
const crypto = require('crypto');

const PASSWORDS_FILE = 'passwords.json';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    return strength === 5 ? 'Strong' : strength >= 3 ? 'Medium' : 'Weak';
}

function savePassword(username, password) {
    const hashedPassword = hashPassword(password);
    let data = {};
    
    if (fs.existsSync(PASSWORDS_FILE)) {
        const fileContent = fs.readFileSync(PASSWORDS_FILE, 'utf8');
        try {
            data = JSON.parse(fileContent);
        } catch (error) {
            console.log('Error reading password file. Creating a new one.');
        }
    }
    
    data[username] = hashedPassword;
    fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(data, null, 4));
    console.log('Password saved securely.');
}

function main() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Enter username: ', username => {
        readline.question('Enter password: ', password => {
            const strength = checkPasswordStrength(password);
            console.log(`Password Strength: ${strength}`);
            
            if (strength !== 'Weak') {
                savePassword(username, password);
            } else {
                console.log('Choose a stronger password!');
            }
            
            readline.close();
        });
    });
}

main();
