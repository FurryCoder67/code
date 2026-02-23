function palindromeSubsequence(word) {
    const isPalindrome = (s) => {
        if (s.length === 2) return s[0] === s[1];
        if (s.length <= 1) return true;
        return isPalindrome(s.slice(1, -1));
    };

    let longest = '';
    const n = word.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= n; j++) {
            const sub = word.slice(i, j);
            if (isPalindrome(sub) && sub.length > longest.length) {
                longest = sub;
            }
        }
    }
    return longest;
}

//console.log(palindromeSubsequence('dmomb'));
function longestPalinSubSeq(s) {
    let n = s.length;

    let curr = new Array(n).fill(0);
    let prev = new Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
        curr[i] = 1;
        for (let j = i + 1; j < n; j++) {
            if (s[i] === s[j]) {
                curr[j] = prev[j - 1] + 2;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        [prev, curr] = [curr, prev];
    }
    return prev[n - 1];
}
console.log(longestPalinSubSeq('dmomb'));