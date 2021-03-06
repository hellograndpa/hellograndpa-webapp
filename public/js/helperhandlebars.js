// Comparison Helper for handlebars.js
// Pass in two values that you want and specify what the operator should be
// e.g. {{#compare val1 val2 operator="=="}}{{/compare}}

const hbs = require('hbs');

const compare = hbs.registerHelper('compare', function (lvalue, rvalue, options) {
  if (arguments.length < 3) throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

  operator = options.hash.operator || '==';

  const operators = {
    '==': function (l, r) {
      return l == r;
    },
    '===': function (l, r) {
      return l === r;
    },
    '!=': function (l, r) {
      return l != r;
    },
    '<': function (l, r) {
      return l < r;
    },
    '>': function (l, r) {
      return l > r;
    },
    '<=': function (l, r) {
      return l <= r;
    },
    '>=': function (l, r) {
      return l >= r;
    },
    typeof(l, r) {
      return typeof l === r;
    },
  };

  if (!operators[operator]) throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);

  const result = operators[operator](lvalue, rvalue);

  if (result) {
    return options.fn(this);
  }
  return options.inverse(this);
});

module.exports = { compare };
