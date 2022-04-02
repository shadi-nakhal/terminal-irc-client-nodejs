async function DisplayInfo(obj) {
  const text = [];
  if (typeof obj === 'string') return `^R**${obj}\n`;
  const keys = Object.keys(obj);
  keys.forEach((e) => {
    if (obj[e] instanceof Object && !Array.isArray(obj[e]) && typeof obj[e] !== 'string') {
      text.push(`^Y**${e}:^ \n`);
      Object.entries(obj[e]).forEach((el) => {
        text.push(`^R----${el.join(': ')}^ \n`);
      });
    } else {
      text.push(`^R--${e}: ${obj[e]}^ \n`);
    }
  });
  return text.join('');
}

module.exports = { DisplayInfo };
