const { server } = require('./util.server');

test('the server should be up', () => {
const serv = server([]);
expect(serv).toBe('server OK');
});