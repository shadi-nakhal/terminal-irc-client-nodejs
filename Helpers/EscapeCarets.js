function EscapeCarets(value) {
  return value.replaceAll('^', '^^');
}

module.exports = { EscapeCarets };
