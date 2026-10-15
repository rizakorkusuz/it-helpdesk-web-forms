/* Pure functions for the ticket intake form. No DOM access, so they can be tested with Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TicketLogic = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PRIORITY = {
    high:   { high: 'P1 Critical', medium: 'P2 High',   low: 'P3 Medium' },
    medium: { high: 'P2 High',     medium: 'P3 Medium', low: 'P4 Low' },
    low:    { high: 'P3 Medium',   medium: 'P4 Low',    low: 'P4 Low' }
  };

  function priorityFor(impact, urgency) {
    var row = PRIORITY[impact];
    return row && row[urgency] ? row[urgency] : null;
  }

  function looksLikeSecret(text) {
    return /(password|passcode|pin)\s*(is|:|=)\s*\S+/i.test(text || '');
  }

  function validate(f) {
    var errors = {};
    if (!f.name || f.name.trim().length < 2) errors.name = 'Enter your name.';
    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = 'Enter a valid email address.';
    if (!f.category) errors.category = 'Choose a category.';
    if (!f.summary || f.summary.trim().length < 8) errors.summary = 'Describe the problem in at least 8 characters.';
    if (f.summary && f.summary.length > 120) errors.summary = 'Keep the summary under 120 characters.';
    if (!f.details || f.details.trim().length < 20) errors.details = 'Add at least 20 characters of detail: what happened and what you expected.';
    if (!priorityFor(f.impact, f.urgency)) errors.impact = 'Choose impact and urgency.';
    if (looksLikeSecret(f.details) || looksLikeSecret(f.summary)) errors.details = 'Do not include passwords or PINs in a ticket.';
    return errors;
  }

  function formatTicket(f, now) {
    var d = now || new Date();
    var lines = [
      'Summary: ' + f.summary.trim(),
      'Category: ' + f.category,
      'Priority: ' + priorityFor(f.impact, f.urgency) + ' (impact ' + f.impact + ', urgency ' + f.urgency + ')',
      'Requester: ' + f.name.trim() + ' <' + f.email.trim() + '>',
      'Location: ' + (f.location ? f.location.trim() : 'not provided'),
      'Device / asset tag: ' + (f.asset ? f.asset.trim() : 'not provided'),
      'Created: ' + d.toISOString(),
      '',
      'Details:',
      f.details.trim()
    ];
    return lines.join('\n');
  }

  function mailtoLink(to, f, now) {
    var body = formatTicket(f, now);
    return 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent('[' + priorityFor(f.impact, f.urgency).split(' ')[0] + '] ' + f.summary.trim()) + '&body=' + encodeURIComponent(body);
  }

  return { priorityFor: priorityFor, validate: validate, formatTicket: formatTicket, mailtoLink: mailtoLink, looksLikeSecret: looksLikeSecret };
}));
