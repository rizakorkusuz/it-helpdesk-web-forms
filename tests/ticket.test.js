const test = require('node:test');
const assert = require('node:assert');
const T = require('../src/ticket.js');

const good = { name: 'Pat Example', email: 'pat@example.com', category: 'Printing', summary: 'Printer offline on floor 2',
  details: 'Printer shows offline since this morning, test page fails.', impact: 'low', urgency: 'medium', location: 'Floor 2', asset: 'PRN-0004' };

test('priority matrix', () => {
  assert.strictEqual(T.priorityFor('high', 'high'), 'P1 Critical');
  assert.strictEqual(T.priorityFor('low', 'low'), 'P4 Low');
  assert.strictEqual(T.priorityFor('medium', 'high'), 'P2 High');
  assert.strictEqual(T.priorityFor('', 'high'), null);
});

test('valid ticket has no errors', () => assert.deepStrictEqual(T.validate(good), {}));

test('missing fields are reported', () => {
  const e = T.validate({ name: '', email: 'bad', category: '', summary: 'x', details: 'short', impact: '', urgency: '' });
  ['name', 'email', 'category', 'summary', 'details', 'impact'].forEach(k => assert.ok(e[k], k));
});

test('passwords in details are rejected', () => {
  const e = T.validate(Object.assign({}, good, { details: 'My password is Hunter2 and it fails to sign in.' }));
  assert.match(e.details, /passwords/i);
});

test('format includes priority and details', () => {
  const t = T.formatTicket(good, new Date('2026-10-15T12:00:00Z'));
  assert.match(t, /Priority: P4 Low/);
  assert.match(t, /Created: 2026-10-15T12:00:00.000Z/);
  assert.match(t, /Details:\nPrinter shows offline/);
});

test('mailto link is encoded', () => {
  const l = T.mailtoLink('helpdesk@example.com', good, new Date('2026-10-15T12:00:00Z'));
  assert.ok(l.startsWith('mailto:helpdesk%40example.com?subject='));
  assert.ok(l.includes(encodeURIComponent('[P4] Printer offline on floor 2')));
});
