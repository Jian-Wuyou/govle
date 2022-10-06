// Public key for encrypting user UVLê credentials
const govle_public_key = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyS0cFOQw1n/x6i++xSPq
uhgTIvquvv6oj1SDc7e17nDtM5jfq5AExgcH83UP225+QPTmVO9jLgKB5tbVXESo
74xFZIPNyQCLlFaRqb1AedTcMf4QWqah0oXfu5otYzX9On1qx4tqmVCi8aalv42D
4Do0I20zrS4OGaKeg2Luqz1aGr1cedb462Ao9rk3FT/PRVjpa+LwlJa7JoyhXimY
e0+Hy5lTfH38+Wh+0onBhVLEmEYUcF47BzAu7WLie1FoRDnXh/vNQTuletTYVkFv
dE66zTr8eqW7Y7CaZoQ3klHVRiQwz6vwQYP7XlXup1IwsK+nYoGltDkWlZPmFude
RxSNrR4z90oD5nTB4IWCyBYXVWK2ZmRYfI5tb9Fag+1YfEh2X3H0W+4GGJZYXKVZ
PEPzu4b3sqjmJVPBVo61XRSRYgNCuZRVskQKH3IeV8BA0G0q5EtqrB+h/LKga9Vh
BLP9znW0xMsaZdOwkNV3EHAlZfc3B/o+ayMrCVa2BEu7cjO934S3HqNzkaY/N6op
+nLSfpqkR0WtGbH8hFp+8yhyl96xDdwnMEdBESt4yFmXn3GII2tiA2MvXea3EkNB
UHkc+1H7WUH6N8R+L8KBMvGu7WEUe9rWGHkomvceQbfgNGnQMbt60CS+oUuQiU9e
K1Z/UrUgs/OCRvnAekt0dOcCAwEAAQ==
-----END PUBLIC KEY-----`;

(() => {
    // Unhide the form when the "I understand" checkbox is filled
    const checkbox = document.getElementById('exampleCheck1');
    const form = document.getElementsByTagName('form')[0];
    const message = document.getElementById('alert-content');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            form.style.display = 'block';
            message.style.display = 'none';
        } else {
            form.style.display = 'none';
            message.style.display = 'block';
        }
    });

    // Form submit handler
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get username and password
        const username = document.getElementById('uvle-username').value;
        const password = document.getElementById('uvle-password').value;

        // Check if either field is empty
        if (username.length === 0 || password.length === 0) {
            alert('Please fill in both fields');
            return;
        }

        // Encrypt credentials
        const credentials = `${username}:${password}`;
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(govle_public_key);
        const encrypted = encrypt.encrypt(credentials);

        // Transmit encrypted credentials to server via POST
        fetch('/link-uvle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credentials: encrypted,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data['success']) {
                    window.location.href = '/settings';
                } else {
                    alert(data['error']);
                }
            });
    });
})();
