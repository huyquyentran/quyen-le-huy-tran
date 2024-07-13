
/**
 * Time Complexity: O(n), where n is the input integer. This is because we iterate from 1 to n and accumulate the sum.
 * Space Complexity: O(1). We are using a constant amount of extra space for the sum variable.
 */
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Time Complexity: O(1). The sum is computed using a single arithmetic formula, which takes constant time.
 * Space Complexity: O(1). No additional space is required beyond the input and the return value.
 */
function sum_to_n_b(n: number): number {
	return (n * (n + 1)) / 2;
}

/**
 * Time Complexity: O(n), where n is the input integer. This is because the function calls itself n times.
 * Space Complexity: O(n). Each recursive call adds a new frame to the call stack,
 * so the space complexity is proportional to the depth of the recursion.
 * This solution can lead to a stack overflow error for large values of n.
 */
function sum_to_n_c(n: number): number {
    if (n <= 1) {
        return n;
    }
    return n + sum_to_n_c(n - 1);
}