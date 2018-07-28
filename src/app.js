const Memcached = require('memcached');
const memcached = new Memcached('localhost:11211');

// memcached -m 32 -p 11211 -d
// -d daemon
// -p port
// -m memory-size

//console.log(memcached);
memcached.set('foo', 'memcached你好', 0, function (err) {
    if (err) {
        console.log(error);
    }
    console.log('success');
});


memcached.get('foo', function (err, data) {
    console.log(data);   
});

