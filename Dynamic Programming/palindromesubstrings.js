const palindromic_substrings = (s, map = new Map()) => {
    const n = s.length;
    let count = 0;
    const isPalindrome = (i, j) => {
        if (i >= j) {
            return true;
        }
        if (s[i] !== s[j]) {
            return false;
        }
        if (map.has(i)) {
            return map.get(i);
        } else {
            map.set(i, isPalindrome(i + 1, j - 1));
        }
        return map.get(i);
    };
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            if (isPalindrome(i, j)) {
                count++;
            }
        }
    }
    return count;
}
console.log(palindromic_substrings('abc'));