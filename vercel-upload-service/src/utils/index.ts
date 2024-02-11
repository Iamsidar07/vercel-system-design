const MAX_LENGTH = 5;

export function generate() {
  let ans = "";
  const subset = "1234567890qwretyuioplkjhgfdszaxcvbnm-";
  for (let char = 0; char < MAX_LENGTH; char++) {
    ans += subset[Math.floor(Math.random() * subset.length)];
  }
  return ans;
}
