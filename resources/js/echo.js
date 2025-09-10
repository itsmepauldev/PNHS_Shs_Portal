import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'e89948a27d393dbc00c6', // from .env PUSHER_APP_KEY
    cluster: 'ap1', // from .env PUSHER_APP_CLUSTER
    forceTLS: true,
    encrypted: true,
    authEndpoint: 'http://localhost:8000/broadcasting/auth', // adjust to match your Laravel URL
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    },
});

export default echo;
