(function () {
  'use strict';
  var form = document.getElementById('ticket-form');
  var out = document.getElementById('output');
  var preview = document.getElementById('preview');
  var mail = document.getElementById('mail');
  var DEMO_ADDRESS = 'helpdesk@example.com'; // placeholder: replace with your own mailbox

  function read() {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value; });
    return data;
  }
  function showErrors(errors) {
    Array.prototype.forEach.call(form.querySelectorAll('[data-error-for]'), function (n) {
      n.textContent = errors[n.getAttribute('data-error-for')] || '';
    });
  }
  function updatePriority() {
    var d = read();
    var p = window.TicketLogic.priorityFor(d.impact, d.urgency);
    document.getElementById('priority').textContent = p ? 'Suggested priority: ' + p : 'Choose impact and urgency to see the suggested priority.';
  }
  form.addEventListener('change', updatePriority);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = read();
    var errors = window.TicketLogic.validate(d);
    showErrors(errors);
    if (Object.keys(errors).length) { out.hidden = true; return; }
    preview.textContent = window.TicketLogic.formatTicket(d);
    mail.href = window.TicketLogic.mailtoLink(DEMO_ADDRESS, d);
    out.hidden = false;
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copy').addEventListener('click', function () {
    if (navigator.clipboard) navigator.clipboard.writeText(preview.textContent);
  });
  updatePriority();
}());
