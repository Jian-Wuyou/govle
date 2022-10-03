const LinkedAccount = (username, img_url, type) => `
    <div class="row linked-account mb-4">
        <div class="col-4">
            <img src="${img_url}" alt="${username}" class="w-100">
        </div>
        <div class="col-8">
            <h4>${username}</h4>
            <p class="text-dark">${type}</p>
            <a class="p" href="#">Disconnect account...</a>
        </div>
    </div>
</div>
`;

const unlink_account = (type, id) => {
    fetch('/api/v1/settings/unlink', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: type,
            id: id,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response['success'] === true) {
                window.location.reload();
            } else {
                alert('Failed to unlink account. Error: ' + response['error']);
            }
        });
};

(() => {
    // Get list of accounts from API
    fetch('/api/v1/accounts')
        .then((response) => response.json())
        .then((all_accounts) => {
            const account_list = document.getElementById('linked-accounts');

            // Empty container
            while (account_list.firstChild) {
                account_list.removeChild(account_list.firstChild);
            }

            // Check if Moodle account is present
            if (all_accounts['moodle']) {
                const linked_moodle = document
                    .createRange()
                    .createContextualFragment(
                        LinkedAccount(
                            all_accounts['moodle']['username'],
                            'https://uvle.upd.edu.ph/pluginfile.php/1/core_admin/logocompact/300x300/1645818713/logo-uvle-min-1024x1024.png',
                            all_accounts['moodle']['server']
                        )
                    );

                linked_moodle.querySelector('a').addEventListener('click', () => unlink_account('moodle', ''));
                account_list.appendChild(linked_moodle);
            }

            // List all Google accounts
            for (const google_account of all_accounts['google']) {
                const linked_google = document
                    .createRange()
                    .createContextualFragment(
                        LinkedAccount(google_account['email'], google_account['gravatar'], 'Google Classroom')
                    );

                linked_google
                    .querySelector('a')
                    .addEventListener('click', () => unlink_account('google', google_account['id']));
                account_list.appendChild(linked_google);
            }
        });

    // Listen to account deletion click event
    document.getElementById('confirm-delete').click(() => {
        fetch('/api/v1/settings/delete_account', { method: 'POST' })
            .then((response) => response.json())
            .then((response) => {
                if (response.success === true) {
                    window.location.href = '/';
                } else {
                    alert(response.error);
                }
            });
    });
})();
