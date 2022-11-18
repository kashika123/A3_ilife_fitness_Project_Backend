const paypal = require('paypal-rest-sdk')

const clientId = 'AV9eMYunAxrOtuX5Ky_14msXauYgpjAUAn4GiJNWpVhcyEM6HIE1UFgIeUYa3-W7AdAGzj0sRKf-kJYY'
const secret = 'EGV4cmhgR0ter70UdKIfkXP19uwgNFYwaL09Luuwb8uCpOleub4NiOktAa2ZsJdbGF_c8tDQ7-JT_iTW'
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': clientId,
    'client_secret': secret
});

const webhooks = {
    "url": "https://8690-89-95-113-14.eu.ngrok.io/checkout",
    "event_types": [{
        "name": "PAYMENT.SALE.COMPLETED"
    }, {
        "name": "PAYMENT.SALE.DENIED"
    }
    ]
};


paypal.notification.webhook.create(webhooks, function (err, webhook) {
    if (err) {
        console.log(err.response);

    } else {
        console.log("Create webhook Response");
        console.log(webhook);
    }
});


