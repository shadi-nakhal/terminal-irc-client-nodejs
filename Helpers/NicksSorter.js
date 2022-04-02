const chars = '@%&+_.()#`\\\'^-=01234567989abcdefghijklmnopqrstuvwxyz';
function NickSorter(list) {
  const array = list.map((obj) => {
    if (obj.prefix) {
      const prefix = obj.prefix.sort((a, b) => method(a, b))[0];
      return prefix + obj.nickname;
    } return obj.nickname;
  });
  function method(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const indexA = chars.indexOf(a[0]);
    const indexB = chars.indexOf(b[0]);
    if (indexA === indexB) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
    return indexA - indexB;
  }
  return array.sort((arrA, arrB) => method(arrA, arrB)).join('\n');
}

module.exports = { NickSorter };
