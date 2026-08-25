// Initial Challenges Data for CodePerks Platform
export const initialChallenges = [
  {
    id: 'chall_01',
    title: 'Two Sum Target Pairs',
    topic: 'Arrays',
    difficulty: 'Easy',
    points: 50,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-01',
    acceptanceRate: '84%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    inputFormat: `First line contains integer N (size of array).\nSecond line contains N space-separated integers.\nThird line contains integer target.`,
    outputFormat: `Print the two 0-based indices separated by a single space in increasing order.`,
    constraints: `2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.`,
    sampleInput: `4\n2 7 11 15\n9`,
    sampleOutput: `0 1`,
    explanation: `Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.`,
    starterCodes: {
      python: `def two_sum(nums, target):\n    # Write your logic here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return f"{hashmap[complement]} {i}"\n        hashmap[num] = i\n    return ""\n\nimport sys\ninput_data = sys.stdin.read().split()\nif input_data:\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    target = int(input_data[n+1])\n    print(two_sum(nums, target))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> mp;\n    for(int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if (mp.count(comp)) {\n            cout << mp[comp] << " " << i << endl;\n            return 0;\n        }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int nums[1000];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { id: 2, input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { id: 3, input: '2\n3 3\n6', expectedOutput: '0 1', isHidden: true },
      { id: 4, input: '5\n1 5 3 7 9\n12', expectedOutput: '1 3', isHidden: true }
    ]
  },
  {
    id: 'chall_02',
    title: 'Valid Palindrome String',
    topic: 'Strings',
    difficulty: 'Easy',
    points: 40,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-03',
    acceptanceRate: '92%',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: `A single line containing the string S.`,
    outputFormat: `Print "true" or "false" (lowercase).`,
    constraints: `1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.`,
    sampleInput: `A man, a plan, a canal: Panama`,
    sampleOutput: `true`,
    explanation: `"amanaplanacanalpanama" is a palindrome.`,
    starterCodes: {
      python: `import sys\nimport re\n\ndef is_palindrome(s):\n    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())\n    return "true" if cleaned == cleaned[::-1] else "false"\n\ns = sys.stdin.read().strip()\nprint(is_palindrome(s))`,
      cpp: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    string cleaned = "";\n    for(char c : s) {\n        if (isalnum(c)) cleaned += tolower(c);\n    }\n    int l = 0, r = cleaned.length() - 1;\n    bool ok = true;\n    while(l < r) {\n        if (cleaned[l++] != cleaned[r--]) { ok = false; break; }\n    }\n    cout << (ok ? "true" : "false") << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));\n        }\n        String str = sb.toString();\n        String rev = sb.reverse().toString();\n        System.out.println(str.equals(rev) ? "true" : "false");\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint main() {\n    char s[1000], clean[1000];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    int idx = 0;\n    for (int i = 0; s[i]; i++) {\n        if (isalnum(s[i])) clean[idx++] = tolower(s[i]);\n    }\n    clean[idx] = '\\0';\n    int ok = 1;\n    for (int i = 0; i < idx / 2; i++) {\n        if (clean[i] != clean[idx - 1 - i]) { ok = 0; break; }\n    }\n    printf("%s\\n", ok ? "true" : "false");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', isHidden: false },
      { id: 2, input: 'race a car', expectedOutput: 'false', isHidden: false },
      { id: 3, input: ' ', expectedOutput: 'true', isHidden: true },
      { id: 4, input: 'Was it a car or a cat I saw?', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: 'chall_03',
    title: 'Balanced Parentheses Stack Check',
    topic: 'Stack',
    difficulty: 'Medium',
    points: 75,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-05',
    acceptanceRate: '71%',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: `A single line containing the bracket string S.`,
    outputFormat: `Print "YES" if valid or "NO" otherwise.`,
    constraints: `1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.`,
    sampleInput: `()[]{}`,
    sampleOutput: `YES`,
    explanation: `All brackets are opened and closed in correct matching pairs.`,
    starterCodes: {
      python: `import sys\n\ndef is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return "NO"\n        else:\n            stack.append(char)\n    return "YES" if not stack else "NO"\n\ns = sys.stdin.read().strip()\nprint(is_valid(s))`,
      cpp: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!(cin >> s)) return 0;\n    stack<char> st;\n    for(char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) { cout << "NO" << endl; return 0; }\n            char top = st.top(); st.pop();\n            if (c == ')' && top != '(') { cout << "NO" << endl; return 0; }\n            if (c == '}' && top != '{') { cout << "NO" << endl; return 0; }\n            if (c == ']' && top != '[') { cout << "NO" << endl; return 0; }\n        }\n    }\n    cout << (st.empty() ? "YES" : "NO") << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Character> st = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.isEmpty()) { System.out.println("NO"); return; }\n                char top = st.pop();\n                if (c == ')' && top != '(') { System.out.println("NO"); return; }\n                if (c == '}' && top != '{') { System.out.println("NO"); return; }\n                if (c == ']' && top != '[') { System.out.println("NO"); return; }\n            }\n        }\n        System.out.println(st.isEmpty() ? "YES" : "NO");\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    if (scanf("%s", s) != 1) return 0;\n    char stack[1000];\n    int top = -1;\n    for (int i = 0; s[i]; i++) {\n        char c = s[i];\n        if (c == '(' || c == '{' || c == '[') stack[++top] = c;\n        else {\n            if (top == -1) { printf("NO\\n"); return 0; }\n            char t = stack[top--];\n            if (c == ')' && t != '(') { printf("NO\\n"); return 0; }\n            if (c == '}' && t != '{') { printf("NO\\n"); return 0; }\n            if (c == ']' && t != '[') { printf("NO\\n"); return 0; }\n        }\n    }\n    printf("%s\\n", top == -1 ? "YES" : "NO");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '()[]{}', expectedOutput: 'YES', isHidden: false },
      { id: 2, input: '(]', expectedOutput: 'NO', isHidden: false },
      { id: 3, input: '([{}])', expectedOutput: 'YES', isHidden: true },
      { id: 4, input: '((()', expectedOutput: 'NO', isHidden: true }
    ]
  },
  {
    id: 'chall_04',
    title: 'Binary Search in Rotated Sorted Array',
    topic: 'Searching',
    difficulty: 'Medium',
    points: 80,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-08',
    acceptanceRate: '64%',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index. Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: `First line: N\nSecond line: N space-separated integers\nThird line: target`,
    outputFormat: `Index of target (0-based) or -1.`,
    constraints: `1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.`,
    sampleInput: `7\n4 5 6 7 0 1 2\n0`,
    sampleOutput: `4`,
    explanation: `0 is found at index 4 in the rotated array.`,
    starterCodes: {
      python: `import sys\n\ndef search_rotated(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]:\n                r = mid - 1\n            else:\n                l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]:\n                l = mid + 1\n            else:\n                r = mid - 1\n    return -1\n\ninp = sys.stdin.read().split()\nif inp:\n    n = int(inp[0])\n    nums = [int(x) for x in inp[1:n+1]]\n    target = int(inp[n+1])\n    print(search_rotated(nums, target))`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    int l = 0, r = n - 1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) { cout << mid << endl; return 0; }\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    cout << -1 << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        int l = 0, r = n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) { System.out.println(mid); return; }\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        System.out.println(-1);\n    }\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int nums[5000];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = (l + r) / 2;\n        if (nums[mid] == target) { printf("%d\\n", mid); return 0; }\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    printf("-1\\n");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '7\n4 5 6 7 0 1 2\n0', expectedOutput: '4', isHidden: false },
      { id: 2, input: '7\n4 5 6 7 0 1 2\n3', expectedOutput: '-1', isHidden: false },
      { id: 3, input: '1\n1\n0', expectedOutput: '-1', isHidden: true },
      { id: 4, input: '5\n3 4 5 1 2\n4', expectedOutput: '1', isHidden: true }
    ]
  },
  {
    id: 'chall_05',
    title: 'Merge K Sorted Linked Lists',
    topic: 'Linked List',
    difficulty: 'Hard',
    points: 120,
    timeLimit: '2.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-11',
    acceptanceRate: '48%',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it as space-separated integers.`,
    inputFormat: `First line: k (number of sorted lists)\nNext k lines: each starts with length M followed by M sorted integers.`,
    outputFormat: `Single line with all elements in ascending order separated by space.`,
    constraints: `k >= 0\n0 <= total nodes <= 10^4\n-10^4 <= Node.val <= 10^4`,
    sampleInput: `3\n3 1 4 5\n3 1 3 4\n2 2 6`,
    sampleOutput: `1 1 2 3 4 4 5 6`,
    explanation: `Merging the 3 lists [1,4,5], [1,3,4], [2,6] results in [1,1,2,3,4,4,5,6].`,
    starterCodes: {
      python: `import sys\nimport heapq\n\ninp = sys.stdin.read().split()\nif inp:\n    k = int(inp[0])\n    idx = 1\n    all_nums = []\n    for _ in range(k):\n        m = int(inp[idx])\n        idx += 1\n        for _ in range(m):\n            all_nums.append(int(inp[idx]))\n            idx += 1\n    all_nums.sort()\n    print(" ".join(map(str, all_nums)))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int k;\n    if (!(cin >> k)) return 0;\n    vector<int> all_nums;\n    for(int i = 0; i < k; i++) {\n        int m;\n        cin >> m;\n        for(int j = 0; j < m; j++) {\n            int val; cin >> val;\n            all_nums.push_back(val);\n        }\n    }\n    sort(all_nums.begin(), all_nums.end());\n    for(size_t i = 0; i < all_nums.size(); i++) {\n        cout << all_nums[i] << (i + 1 == all_nums.size() ? "" : " ");\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int k = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < k; i++) {\n            int m = sc.nextInt();\n            for (int j = 0; j < m; j++) list.add(sc.nextInt());\n        }\n        Collections.sort(list);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            sb.append(list.get(i)).append(i + 1 == list.size() ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint cmp(const void* a, const void* b) {\n    return (*(int*)a - *(int*)b);\n}\n\nint main() {\n    int k;\n    if (scanf("%d", &k) != 1) return 0;\n    int nums[10000];\n    int total = 0;\n    for (int i = 0; i < k; i++) {\n        int m;\n        scanf("%d", &m);\n        for (int j = 0; j < m; j++) {\n            scanf("%d", &nums[total++]);\n        }\n    }\n    qsort(nums, total, sizeof(int), cmp);\n    for (int i = 0; i < total; i++) {\n        printf("%d%s", nums[i], i + 1 == total ? "" : " ");\n    }\n    printf("\\n");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '3\n3 1 4 5\n3 1 3 4\n2 2 6', expectedOutput: '1 1 2 3 4 4 5 6', isHidden: false },
      { id: 2, input: '1\n2 1 2', expectedOutput: '1 2', isHidden: false },
      { id: 3, input: '2\n1 9\n2 3 7', expectedOutput: '3 7 9', isHidden: true }
    ]
  },
  {
    id: 'chall_06',
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    points: 70,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-14',
    acceptanceRate: '75%',
    description: `Given the root of a binary tree represented as an array in breadth-first sequence (with -1 indicating null nodes), return the level-order traversal of its nodes' values separated by spaces.`,
    inputFormat: `First line: N (number of array elements representing tree)\nSecond line: N space-separated integers (-1 denotes null).`,
    outputFormat: `Space-separated integers of nodes visited level by level (excluding -1).`,
    constraints: `The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000`,
    sampleInput: `7\n3 9 20 -1 -1 15 7`,
    sampleOutput: `3 9 20 15 7`,
    explanation: `Level 1: 3 | Level 2: 9, 20 | Level 3: 15, 7.`,
    starterCodes: {
      python: `import sys\n\ninp = sys.stdin.read().split()\nif inp:\n    n = int(inp[0])\n    nodes = [int(x) for x in inp[1:n+1]]\n    res = [str(x) for x in nodes if x != -1]\n    print(" ".join(res))`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> res;\n    for(int i = 0; i < n; i++) {\n        int v; cin >> v;\n        if (v != -1) res.push_back(v);\n    }\n    for(size_t i = 0; i < res.size(); i++) {\n        cout << res[i] << (i + 1 == res.size() ? "" : " ");\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        List<Integer> res = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            int v = sc.nextInt();\n            if (v != -1) res.add(v);\n        }\n        for (int i = 0; i < res.size(); i++) {\n            System.out.print(res.get(i) + (i + 1 == res.size() ? "" : " "));\n        }\n        System.out.println();\n    }\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int first = 1;\n    for (int i = 0; i < n; i++) {\n        int v;\n        scanf("%d", &v);\n        if (v != -1) {\n            if (!first) printf(" ");\n            printf("%d", v);\n            first = 0;\n        }\n    }\n    printf("\\n");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3 9 20 15 7', isHidden: false },
      { id: 2, input: '1\n1', expectedOutput: '1', isHidden: false },
      { id: 3, input: '5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', isHidden: true }
    ]
  },
  {
    id: 'chall_07',
    title: 'Sliding Window Maximum',
    topic: 'Queue',
    difficulty: 'Hard',
    points: 100,
    timeLimit: '1.5s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-16',
    acceptanceRate: '52%',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.`,
    inputFormat: `First line: N and K\nSecond line: N space-separated integers`,
    outputFormat: `Space-separated maximum elements for each window position.`,
    constraints: `1 <= nums.length <= 10^5\n1 <= k <= nums.length`,
    sampleInput: `8 3\n1 3 -1 -3 5 3 6 7`,
    sampleOutput: `3 3 5 5 6 7`,
    explanation: `Window positions: [1,3,-1]=>3, [3,-1,-3]=>3, [-1,-3,5]=>5, [-3,5,3]=>5, [5,3,6]=>6, [3,6,7]=>7.`,
    starterCodes: {
      python: `from collections import deque\nimport sys\n\ndef max_sliding_window(nums, k):\n    q = deque()\n    res = []\n    for i, n in enumerate(nums):\n        while q and nums[q[-1]] < n:\n            q.pop()\n        q.append(i)\n        if q[0] == i - k:\n            q.popleft()\n        if i >= k - 1:\n            res.append(str(nums[q[0]]))\n    return " ".join(res)\n\ninp = sys.stdin.read().split()\nif inp:\n    n, k = int(inp[0]), int(inp[1])\n    nums = [int(x) for x in inp[2:n+2]]\n    print(max_sliding_window(nums, k))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    int n, k;\n    if (!(cin >> n >> k)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    deque<int> dq;\n    vector<int> res;\n    for(int i = 0; i < n; i++) {\n        if (!dq.empty() && dq.front() == i - k) dq.pop_front();\n        while(!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) res.push_back(nums[dq.front()]);\n    }\n    for(size_t i = 0; i < res.size(); i++) {\n        cout << res[i] << (i + 1 == res.size() ? "" : " ");\n    }\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        Deque<Integer> dq = new ArrayDeque<>();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (!dq.isEmpty() && dq.peekFirst() == i - k) dq.pollFirst();\n            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();\n            dq.offerLast(i);\n            if (i >= k - 1) {\n                sb.append(nums[dq.peekFirst()]).append(" ");\n            }\n        }\n        System.out.println(sb.toString().trim());\n    }\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n, k;\n    if (scanf("%d %d", &n, &k) != 2) return 0;\n    int nums[10000];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    for (int i = 0; i <= n - k; i++) {\n        int mx = nums[i];\n        for (int j = i + 1; j < i + k; j++) {\n            if (nums[j] > mx) mx = nums[j];\n        }\n        printf("%d%s", mx, i == n - k ? "" : " ");\n    }\n    printf("\\n");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7', isHidden: false },
      { id: 2, input: '1 1\n1', expectedOutput: '1', isHidden: false },
      { id: 3, input: '4 2\n9 11 8 5', expectedOutput: '11 11 8', isHidden: true }
    ]
  },
  {
    id: 'chall_08',
    title: 'Custom Quick Sort Algorithm',
    topic: 'Sorting',
    difficulty: 'Medium',
    points: 60,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-18',
    acceptanceRate: '88%',
    description: `Implement the QuickSort algorithm to sort an array of integers in non-decreasing order.`,
    inputFormat: `First line: N\nSecond line: N space-separated integers`,
    outputFormat: `N space-separated integers in ascending order.`,
    constraints: `1 <= N <= 10^5\n-10^9 <= nums[i] <= 10^9`,
    sampleInput: `6\n10 7 8 9 1 5`,
    sampleOutput: `1 5 7 8 9 10`,
    explanation: `Sorted sequence is 1 5 7 8 9 10.`,
    starterCodes: {
      python: `import sys\n\ninp = sys.stdin.read().split()\nif inp:\n    n = int(inp[0])\n    nums = sorted([int(x) for x in inp[1:n+1]])\n    print(" ".join(map(str, nums)))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    sort(nums.begin(), nums.end());\n    for(int i = 0; i < n; i++) cout << nums[i] << (i + 1 == n ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        Arrays.sort(nums);\n        for (int i = 0; i < n; i++) System.out.print(nums[i] + (i + 1 == n ? "" : " "));\n        System.out.println();\n    }\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint cmp(const void* a, const void* b) {\n    return (*(int*)a - *(int*)b);\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int nums[10000];\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    qsort(nums, n, sizeof(int), cmp);\n    for (int i = 0; i < n; i++) printf("%d%s", nums[i], i + 1 == n ? "" : " ");\n    printf("\\n");\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '6\n10 7 8 9 1 5', expectedOutput: '1 5 7 8 9 10', isHidden: false },
      { id: 2, input: '4\n5 1 1 2 0 0', expectedOutput: '0 0 1 1 2 5', isHidden: false },
      { id: 3, input: '3\n-1 -5 3', expectedOutput: '-5 -1 3', isHidden: true }
    ]
  },
  {
    id: 'chall_09',
    title: 'Fibonacci Sequence Generator',
    topic: 'Basic Programming',
    difficulty: 'Easy',
    points: 30,
    timeLimit: '0.5s',
    status: 'published',
    createdBy: 'Dr. Sarah Sharma',
    createdAt: '2025-08-20',
    acceptanceRate: '95%',
    description: `Compute the N-th Fibonacci number where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n >= 2.`,
    inputFormat: `A single integer N.`,
    outputFormat: `Print the N-th Fibonacci number.`,
    constraints: `0 <= N <= 30`,
    sampleInput: `4`,
    sampleOutput: `3`,
    explanation: `F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3.`,
    starterCodes: {
      python: `import sys\n\ndef fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\ninp = sys.stdin.read().strip()\nif inp:\n    print(fib(int(inp)))`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    if (n == 0) { cout << 0 << endl; return 0; }\n    if (n == 1) { cout << 1 << endl; return 0; }\n    int a = 0, b = 1;\n    for(int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    cout << b << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        if (n == 1) { System.out.println(1); return; }\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n    }\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    if (n == 0) { printf("0\\n"); return 0; }\n    if (n == 1) { printf("1\\n"); return 0; }\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    printf("%d\\n", b);\n    return 0;\n}`
    },
    testCases: [
      { id: 1, input: '4', expectedOutput: '3', isHidden: false },
      { id: 2, input: '2', expectedOutput: '1', isHidden: false },
      { id: 3, input: '10', expectedOutput: '55', isHidden: true },
      { id: 4, input: '0', expectedOutput: '0', isHidden: true }
    ]
  }
];
