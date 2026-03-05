const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.helpbot.cpn7nrk.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Error:', err);
    } else {
        console.log('SRV:', addresses);
    }
});

dns.resolveTxt('helpbot.cpn7nrk.mongodb.net', (err, records) => {
    if (err) {
        console.error('TXT Error:', err);
    } else {
        console.log('TXT:', records);
    }
});
