// seed.js - Seeds the database with initial challenges and rewards
// Run: node seed.js (from the backend directory, with backend running/MongoDB connected)

require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./models/Challenge');
const Reward = require('./models/Reward');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected for seeding...');
};

const challenges = [
  {
    id: 'chall_1001',
    title: 'Sum of Two Numbers',
    topic: 'Basic Programming',
    difficulty: 'Easy',
    points: 50,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given two integers A and B, print their sum.',
    inputFormat: 'Two integers A and B on the same line.',
    outputFormat: 'A single integer which is the sum of A and B.',
    constraints: '1 ≤ A, B ≤ 10^9',
    sampleInput: '3 5',
    sampleOutput: '8',
    explanation: '3 + 5 = 8',
    starterCodes: {
      python: 'a, b = map(int, input().split())\nprint(a + b)',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}',
      c: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '3 5', expectedOutput: '8', isHidden: false },
      { id: 2, input: '10 20', expectedOutput: '30', isHidden: true }
    ]
  },
  {
    id: 'chall_1002',
    title: 'Find Maximum in Array',
    topic: 'Arrays',
    difficulty: 'Easy',
    points: 60,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given an array of N integers, find and print the maximum element.',
    inputFormat: 'First line: integer N (size of array).\nSecond line: N space-separated integers.',
    outputFormat: 'A single integer - the maximum element.',
    constraints: '1 ≤ N ≤ 1000\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '5\n3 1 4 1 5',
    sampleOutput: '5',
    explanation: 'The maximum element in the array is 5.',
    starterCodes: {
      python: 'n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    int arr[n];\n    for(int i = 0; i < n; i++) cin >> arr[i];\n    cout << *max_element(arr, arr+n);\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE;\n        for(int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if(x > max) max = x;\n        }\n        System.out.println(max);\n    }\n}',
      c: '#include <stdio.h>\n#include <limits.h>\nint main() {\n    int n; scanf("%d", &n);\n    int max = INT_MIN, x;\n    for(int i = 0; i < n; i++) {\n        scanf("%d", &x);\n        if(x > max) max = x;\n    }\n    printf("%d\\n", max);\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '5\n3 1 4 1 5', expectedOutput: '5', isHidden: false },
      { id: 2, input: '3\n-1 -5 -3', expectedOutput: '-1', isHidden: true }
    ]
  },
  {
    id: 'chall_1003',
    title: 'Reverse a String',
    topic: 'Strings',
    difficulty: 'Easy',
    points: 60,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given a string S, print the string in reverse order.',
    inputFormat: 'A single string S (no spaces).',
    outputFormat: 'The reversed string.',
    constraints: '1 ≤ |S| ≤ 1000',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    explanation: 'Reversing "hello" gives "olleh".',
    starterCodes: {
      python: 's = input()\nprint(s[::-1])',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s;\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(new StringBuilder(s).reverse());\n    }\n}',
      c: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1001];\n    scanf("%s", s);\n    int n = strlen(s);\n    for(int i = n-1; i >= 0; i--) printf("%c", s[i]);\n    printf("\\n");\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: 'hello', expectedOutput: 'olleh', isHidden: false },
      { id: 2, input: 'abcde', expectedOutput: 'edcba', isHidden: true }
    ]
  },
  {
    id: 'chall_1004',
    title: 'Factorial of a Number',
    topic: 'Basic Programming',
    difficulty: 'Easy',
    points: 50,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given an integer N, compute N! (N factorial).',
    inputFormat: 'A single integer N.',
    outputFormat: 'The value of N!',
    constraints: '0 ≤ N ≤ 12',
    sampleInput: '5',
    sampleOutput: '120',
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120',
    starterCodes: {
      python: 'n = int(input())\nresult = 1\nfor i in range(1, n+1):\n    result *= i\nprint(result)',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long f = 1;\n    for(int i = 1; i <= n; i++) f *= i;\n    cout << f;\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long f = 1;\n        for(int i = 1; i <= n; i++) f *= i;\n        System.out.println(f);\n    }\n}',
      c: '#include <stdio.h>\nint main() {\n    int n; scanf("%d", &n);\n    long long f = 1;\n    for(int i = 1; i <= n; i++) f *= i;\n    printf("%lld\\n", f);\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '5', expectedOutput: '120', isHidden: false },
      { id: 2, input: '0', expectedOutput: '1', isHidden: true }
    ]
  },
  {
    id: 'chall_1005',
    title: 'Binary Search',
    topic: 'Searching',
    difficulty: 'Medium',
    points: 100,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given a sorted array of N integers and a target value K, determine if K exists in the array. Print "YES" if found, else "NO".',
    inputFormat: 'Line 1: N (size of array) and K (target)\nLine 2: N space-separated sorted integers.',
    outputFormat: '"YES" if K is found, else "NO".',
    constraints: '1 ≤ N ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9',
    sampleInput: '5 4\n1 2 3 4 5',
    sampleOutput: 'YES',
    explanation: '4 is present in the array at index 3.',
    starterCodes: {
      python: 'line1 = input().split()\nn, k = int(line1[0]), int(line1[1])\narr = list(map(int, input().split()))\nlow, high = 0, n - 1\nfound = False\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == k:\n        found = True\n        break\n    elif arr[mid] < k:\n        low = mid + 1\n    else:\n        high = mid - 1\nprint("YES" if found else "NO")',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k;\n    cin >> n >> k;\n    int arr[n];\n    for(int i = 0; i < n; i++) cin >> arr[i];\n    cout << (binary_search(arr, arr+n, k) ? "YES" : "NO");\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(Arrays.binarySearch(arr, k) >= 0 ? "YES" : "NO");\n    }\n}',
      c: '#include <stdio.h>\nint bsearch(int *a, int n, int k) {\n    int lo=0, hi=n-1;\n    while(lo<=hi){int m=(lo+hi)/2; if(a[m]==k)return 1; if(a[m]<k)lo=m+1; else hi=m-1;}\n    return 0;\n}\nint main(){\n    int n,k; scanf("%d%d",&n,&k);\n    int arr[n];\n    for(int i=0;i<n;i++) scanf("%d",&arr[i]);\n    printf("%s\\n", bsearch(arr,n,k)?"YES":"NO");\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '5 4\n1 2 3 4 5', expectedOutput: 'YES', isHidden: false },
      { id: 2, input: '4 7\n1 3 5 9', expectedOutput: 'NO', isHidden: true }
    ]
  },
  {
    id: 'chall_1006',
    title: 'Bubble Sort',
    topic: 'Sorting',
    difficulty: 'Medium',
    points: 100,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given an array of N integers, sort them in ascending order using any sorting method and print the sorted array.',
    inputFormat: 'Line 1: N\nLine 2: N space-separated integers.',
    outputFormat: 'N space-separated integers in sorted order.',
    constraints: '1 ≤ N ≤ 1000',
    sampleInput: '5\n5 3 1 4 2',
    sampleOutput: '1 2 3 4 5',
    explanation: 'Sorting [5, 3, 1, 4, 2] in ascending order gives [1, 2, 3, 4, 5].',
    starterCodes: {
      python: 'n = int(input())\narr = list(map(int, input().split()))\narr.sort()\nprint(*arr)',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    int arr[n];\n    for(int i=0;i<n;i++) cin>>arr[i];\n    sort(arr, arr+n);\n    for(int i=0;i<n;i++) cout<<arr[i]<<(i<n-1?" ":"\\n");\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i=0;i<n;i++) arr[i]=sc.nextInt();\n        Arrays.sort(arr);\n        StringBuilder sb = new StringBuilder();\n        for(int i=0;i<n;i++) sb.append(arr[i]).append(i<n-1?" ":"");\n        System.out.println(sb);\n    }\n}',
      c: '#include <stdio.h>\n#include <stdlib.h>\nint cmp(const void *a, const void *b){return *(int*)a - *(int*)b;}\nint main(){\n    int n; scanf("%d",&n);\n    int arr[n];\n    for(int i=0;i<n;i++) scanf("%d",&arr[i]);\n    qsort(arr,n,sizeof(int),cmp);\n    for(int i=0;i<n;i++) printf("%d%s",arr[i],i<n-1?" ":"\\n");\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', isHidden: false },
      { id: 2, input: '3\n9 3 7', expectedOutput: '3 7 9', isHidden: true }
    ]
  },
  {
    id: 'chall_1007',
    title: 'Check Palindrome',
    topic: 'Strings',
    difficulty: 'Easy',
    points: 60,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given a string S, check whether it is a palindrome. Print "YES" if it is a palindrome, else "NO".',
    inputFormat: 'A single string S (no spaces, lowercase).',
    outputFormat: '"YES" or "NO".',
    constraints: '1 ≤ |S| ≤ 1000',
    sampleInput: 'racecar',
    sampleOutput: 'YES',
    explanation: '"racecar" reads the same forwards and backwards.',
    starterCodes: {
      python: 's = input()\nprint("YES" if s == s[::-1] else "NO")',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    string r = s; reverse(r.begin(), r.end());\n    cout << (s == r ? "YES" : "NO");\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(s.equals(new StringBuilder(s).reverse().toString()) ? "YES" : "NO");\n    }\n}',
      c: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1001]; scanf("%s",s);\n    int n=strlen(s); int ok=1;\n    for(int i=0;i<n/2;i++) if(s[i]!=s[n-1-i]){ok=0;break;}\n    printf("%s\\n",ok?"YES":"NO");\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: 'racecar', expectedOutput: 'YES', isHidden: false },
      { id: 2, input: 'hello', expectedOutput: 'NO', isHidden: true }
    ]
  },
  {
    id: 'chall_1008',
    title: 'Count Occurrences',
    topic: 'Arrays',
    difficulty: 'Medium',
    points: 100,
    timeLimit: '1.0s',
    status: 'published',
    createdBy: 'CSE Faculty',
    description: 'Given an array of N integers and a target K, count how many times K appears in the array.',
    inputFormat: 'Line 1: N and K\nLine 2: N space-separated integers.',
    outputFormat: 'The count of K in the array.',
    constraints: '1 ≤ N ≤ 10^5',
    sampleInput: '6 3\n1 3 2 3 4 3',
    sampleOutput: '3',
    explanation: '3 appears 3 times in the array.',
    starterCodes: {
      python: 'line1 = input().split()\nn, k = int(line1[0]), int(line1[1])\narr = list(map(int, input().split()))\nprint(arr.count(k))',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n, k; cin >> n >> k;\n    int cnt = 0, x;\n    for(int i = 0; i < n; i++) { cin >> x; if(x == k) cnt++; }\n    cout << cnt;\n    return 0;\n}',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int cnt = 0;\n        for(int i=0;i<n;i++) if(sc.nextInt()==k) cnt++;\n        System.out.println(cnt);\n    }\n}',
      c: '#include <stdio.h>\nint main() {\n    int n,k; scanf("%d%d",&n,&k);\n    int cnt=0,x;\n    for(int i=0;i<n;i++){scanf("%d",&x);if(x==k)cnt++;}\n    printf("%d\\n",cnt);\n    return 0;\n}'
    },
    testCases: [
      { id: 1, input: '6 3\n1 3 2 3 4 3', expectedOutput: '3', isHidden: false },
      { id: 2, input: '5 7\n1 2 3 4 5', expectedOutput: '0', isHidden: true }
    ]
  }
];

const rewards = [
  {
    id: 'rew_1001',
    name: 'Free Coffee Voucher',
    description: 'Redeem for one free coffee at the campus cafeteria.',
    vendor: 'Campus Cafeteria',
    category: 'Food',
    pointsRequired: 100,
    availableQuantity: 20,
    totalQuantity: 20,
    status: 'active',
    image: '☕',
    tag: 'Popular'
  },
  {
    id: 'rew_1002',
    name: 'Notebook & Pen Set',
    description: 'Quality A4 notebook and ball pen set for your studies.',
    vendor: 'Campus Stationery',
    category: 'Stationery',
    pointsRequired: 150,
    availableQuantity: 15,
    totalQuantity: 15,
    status: 'active',
    image: '📚',
    tag: ''
  },
  {
    id: 'rew_1003',
    name: 'Canteen Meal Coupon',
    description: 'One full meal (thali) at the college canteen.',
    vendor: 'College Canteen',
    category: 'Food',
    pointsRequired: 200,
    availableQuantity: 30,
    totalQuantity: 30,
    status: 'active',
    image: '🍱',
    tag: 'Best Value'
  },
  {
    id: 'rew_1004',
    name: 'Tech Event Pass',
    description: 'Free entry to the next department tech fest or workshop.',
    vendor: 'CSE Department',
    category: 'Events',
    pointsRequired: 300,
    availableQuantity: 10,
    totalQuantity: 10,
    status: 'active',
    image: '🎪',
    tag: 'Limited'
  },
  {
    id: 'rew_1005',
    name: 'Printing Credits (50 pages)',
    description: 'Print up to 50 pages at the department printing room.',
    vendor: 'Library & Printing',
    category: 'Campus Offers',
    pointsRequired: 75,
    availableQuantity: 50,
    totalQuantity: 50,
    status: 'active',
    image: '🖨️',
    tag: ''
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing
    await Challenge.deleteMany({});
    await Reward.deleteMany({});
    console.log('Cleared existing challenges and rewards.');

    // Insert challenges
    await Challenge.insertMany(challenges);
    console.log(`Inserted ${challenges.length} challenges.`);

    // Insert rewards
    await Reward.insertMany(rewards);
    console.log(`Inserted ${rewards.length} rewards.`);

    console.log('\n✓ Seed completed successfully!');
    console.log('You can now signup/login and start using the platform.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedData();
