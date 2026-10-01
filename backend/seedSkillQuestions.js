const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');

const initialQuestionBanks = {
  'Python': [
    { question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correctAnswer: 'def', explanation: 'Python uses the def keyword to define a function.' },
    { question: 'Which symbol is used for single-line comments in Python?', options: ['//', '#', '/*', '<!--'], correctAnswer: '#', explanation: 'Single line comments in Python start with #' },
    { question: 'Which of the following is a Python list syntax?', options: ['{1, 2, 3}', '[1, 2, 3]', '(1, 2, 3)', '<1, 2, 3>'], correctAnswer: '[1, 2, 3]', explanation: 'Lists in Python are enclosed in square brackets.' },
    { question: 'What is the first index of a Python list?', options: ['0', '1', '-1', 'None'], correctAnswer: '0', explanation: 'Python indexing is 0-based.' },
    { question: 'Which built-in function returns the length of a list?', options: ['size()', 'count()', 'len()', 'length()'], correctAnswer: 'len()', explanation: 'len() returns item count.' },
    { question: 'What is the output of print(2 ** 3) in Python?', options: ['6', '8', '9', '5'], correctAnswer: '8', explanation: '** is the exponentiation operator.' },
    { question: 'Which data structure stores key-value pairs in Python?', options: ['Set', 'Tuple', 'List', 'Dictionary'], correctAnswer: 'Dictionary', explanation: 'Dictionaries store key-value mapping.' },
    { question: 'How do you convert a string "123" into an integer in Python?', options: ['int("123")', 'str("123")', 'float("123")', 'parse("123")'], correctAnswer: 'int("123")', explanation: 'int() converts string to integer.' },
    { question: 'Which keyword is used for conditional branching in Python?', options: ['else if', 'elseif', 'elif', 'if else'], correctAnswer: 'elif', explanation: 'elif is short for else if in Python.' },
    { question: 'What does the append() method do on a Python list?', options: ['Removes last item', 'Adds item to the end', 'Sorts the list', 'Reverses the list'], correctAnswer: 'Adds item to the end', explanation: 'append() adds an element to the list end.' },
    { question: 'Which statement is used to exit a loop prematurely in Python?', options: ['exit', 'stop', 'break', 'return'], correctAnswer: 'break', explanation: 'break terminates the loop.' },
    { question: 'What is the type of the value True in Python?', options: ['string', 'bool', 'int', 'flag'], correctAnswer: 'bool', explanation: 'True and False are boolean types.' },
    { question: 'Which method converts all characters in a string to lowercase?', options: ['toLower()', 'lowercase()', 'lower()', 'down()'], correctAnswer: 'lower()', explanation: 'lower() returns lowercase string.' },
    { question: 'What is the result of type([]) in Python?', options: ['<class "array">', '<class "list">', '<class "set">', '<class "object">'], correctAnswer: '<class "list">', explanation: '[] is a list type.' },
    { question: 'Which operator is used for integer floor division in Python?', options: ['/', '//', '%', 'div'], correctAnswer: '//', explanation: '// performs floor division.' },
    { question: 'What keyword is used to handle exceptions in Python?', options: ['try / catch', 'try / except', 'do / catch', 'try / handle'], correctAnswer: 'try / except', explanation: 'Python uses try...except blocks.' },
    { question: 'Which module is used to work with random numbers in Python?', options: ['math', 'rand', 'random', 'number'], correctAnswer: 'random', explanation: 'random module provides random functions.' },
    { question: 'What does range(3) produce when iterated over?', options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '1, 2'], correctAnswer: '0, 1, 2', explanation: 'range(3) starts at 0 and stops before 3.' },
    { question: 'How do you create an empty dictionary in Python?', options: ['[]', '{}', '()', 'dict() only'], correctAnswer: '{}', explanation: '{} creates an empty dictionary.' },
    { question: 'Which keyword is used to import a library in Python?', options: ['include', 'require', 'import', 'use'], correctAnswer: 'import', explanation: 'import keyword imports modules.' }
  ],
  'JavaScript': [
    { question: 'Which keyword is used to declare a constant variable in JavaScript?', options: ['var', 'let', 'const', 'static'], correctAnswer: 'const', explanation: 'const declares block-scoped immutable variables.' },
    { question: 'What does console.log(typeof []) output in JavaScript?', options: ['"array"', '"object"', '"list"', '"undefined"'], correctAnswer: '"object"', explanation: 'Arrays are objects in JavaScript.' },
    { question: 'Which method converts a JSON string into a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'], correctAnswer: 'JSON.parse()', explanation: 'JSON.parse() parses JSON strings.' },
    { question: 'Which operator checks both value and type equality in JS?', options: ['==', '===', '=', 'equals'], correctAnswer: '===', explanation: '=== is strict equality.' },
    { question: 'What is the output of "5" + 2 in JavaScript?', options: ['7', '"52"', 'NaN', 'Error'], correctAnswer: '"52"', explanation: 'String concatenation occurs with +.' },
    { question: 'Which array method adds an item to the end of an array?', options: ['pop()', 'push()', 'shift()', 'unshift()'], correctAnswer: 'push()', explanation: 'push() appends items to an array.' },
    { question: 'Which array method removes the last element of an array?', options: ['pop()', 'push()', 'shift()', 'splice()'], correctAnswer: 'pop()', explanation: 'pop() removes the last element.' },
    { question: 'What keyword is used to define an asynchronous function in JS?', options: ['sync', 'async', 'defer', 'promise'], correctAnswer: 'async', explanation: 'async keyword defines async functions.' },
    { question: 'Which method creates a new array with results of calling a function on every element?', options: ['forEach()', 'filter()', 'map()', 'reduce()'], correctAnswer: 'map()', explanation: 'map() transforms array elements.' },
    { question: 'What is the default value of an uninitialized variable in JS?', options: ['null', 'undefined', '0', 'false'], correctAnswer: 'undefined', explanation: 'Unassigned variables are undefined.' },
    { question: 'Which built-in object handles mathematical calculations in JS?', options: ['Calc', 'Math', 'Number', 'Algorithm'], correctAnswer: 'Math', explanation: 'Math object provides math utilities.' },
    { question: 'How do you write an arrow function in JS?', options: ['function => ()', '() => {}', 'def () {}', 'arrow () {}'], correctAnswer: '() => {}', explanation: '() => {} is arrow function syntax.' },
    { question: 'Which method converts an object into a JSON string?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.encode()', 'JSON.serialize()'], correctAnswer: 'JSON.stringify()', explanation: 'JSON.stringify() serializes to JSON string.' },
    { question: 'What does NaN stand for in JavaScript?', options: ['New and Number', 'Not a Number', 'Null and Number', 'No Assigned Value'], correctAnswer: 'Not a Number', explanation: 'NaN stands for Not a Number.' },
    { question: 'Which method executes a function after a delay in milliseconds?', options: ['setTimer()', 'setTimeout()', 'delay()', 'wait()'], correctAnswer: 'setTimeout()', explanation: 'setTimeout() schedules delayed execution.' },
    { question: 'Which array method filters elements based on a condition?', options: ['map()', 'filter()', 'slice()', 'find()'], correctAnswer: 'filter()', explanation: 'filter() creates a filtered array.' },
    { question: 'What is the scope of a variable declared with "let"?', options: ['Global', 'Block scope', 'Function scope only', 'Module scope'], correctAnswer: 'Block scope', explanation: 'let is block-scoped.' },
    { question: 'Which method joins all elements of an array into a string?', options: ['concat()', 'join()', 'combine()', 'toString()'], correctAnswer: 'join()', explanation: 'join() concatenates array items with a separator.' },
    { question: 'What does Event.preventDefault() do?', options: ['Stops event bubbling', 'Prevents default browser action', 'Cancels function execution', 'Reloads page'], correctAnswer: 'Prevents default browser action', explanation: 'preventDefault() stops default behavior like form submission.' },
    { question: 'Which keyword handles promise resolution in async/await?', options: ['then', 'await', 'catch', 'wait'], correctAnswer: 'await', explanation: 'await waits for a Promise to resolve.' }
  ],
  'React': [
    { question: 'Which hook is used to manage local component state in React?', options: ['useEffect', 'useContext', 'useState', 'useReducer'], correctAnswer: 'useState', explanation: 'useState manages local state.' },
    { question: 'Which hook handles side effects in functional components?', options: ['useState', 'useEffect', 'useMemo', 'useRef'], correctAnswer: 'useEffect', explanation: 'useEffect handles side effects.' },
    { question: 'What syntax extension allows writing HTML-like code inside JS?', options: ['HTMLX', 'JSX', 'ReactDOM', 'TSX'], correctAnswer: 'JSX', explanation: 'JSX stands for JavaScript XML.' },
    { question: 'How do you pass data down from a parent to a child component?', options: ['State', 'Props', 'Redux', 'Context'], correctAnswer: 'Props', explanation: 'Props pass read-only data to child components.' },
    { question: 'What is the purpose of keys when rendering lists in React?', options: ['To style items', 'To give unique identity for re-rendering optimization', 'To secure data', 'To order elements'], correctAnswer: 'To give unique identity for re-rendering optimization', explanation: 'Keys help React identify changed list items.' },
    { question: 'Which hook returns a persistent mutable ref object?', options: ['useRef', 'useState', 'useMemo', 'useCallback'], correctAnswer: 'useRef', explanation: 'useRef maintains reference values across renders.' },
    { question: 'What must a functional component return in React?', options: ['A JSON object', 'JSX / React Element', 'A boolean', 'An array only'], correctAnswer: 'JSX / React Element', explanation: 'Components return JSX elements.' },
    { question: 'Which hook memoizes expensive calculation results?', options: ['useCallback', 'useMemo', 'useRef', 'useEffect'], correctAnswer: 'useMemo', explanation: 'useMemo caches calculated values.' },
    { question: 'How do you handle click events in React?', options: ['onclick="handleClick()"', 'onClick={handleClick}', 'click={handleClick}', 'on-click={handleClick}'], correctAnswer: 'onClick={handleClick}', explanation: 'React uses camelCase event handlers like onClick.' },
    { question: 'Which hook accesses Context values in React?', options: ['useContext', 'useState', 'useProvider', 'useConsumer'], correctAnswer: 'useContext', explanation: 'useContext consumes Context data.' },
    { question: 'What is Virtual DOM in React?', options: ['Direct HTML DOM', 'Lightweight in-memory representation of real DOM', 'Database engine', 'CSS styling engine'], correctAnswer: 'Lightweight in-memory representation of real DOM', explanation: 'Virtual DOM optimizes DOM updates.' },
    { question: 'Which hook memoizes callback function definitions?', options: ['useMemo', 'useCallback', 'useRef', 'useState'], correctAnswer: 'useCallback', explanation: 'useCallback memoizes function instances.' },
    { question: 'What is the default export component syntax in React?', options: ['module.exports = Component', 'export default Component', 'export Component', 'public Component'], correctAnswer: 'export default Component', explanation: 'ES6 export default syntax.' },
    { question: 'Which tool bundle/dev server creates fast React apps today?', options: ['Vite', 'Gulp', 'Babel', 'Grunt'], correctAnswer: 'Vite', explanation: 'Vite is a fast modern build tool for React.' },
    { question: 'What happens if you update state directly without setter function?', options: ['React updates immediately', 'Component will not re-render', 'Application crashes', 'Page reloads'], correctAnswer: 'Component will not re-render', explanation: 'Direct mutation does not trigger re-render.' },
    { question: 'What is conditional rendering in React?', options: ['Rendering elements based on condition', 'Compiling code', 'Validating forms', 'Routing pages'], correctAnswer: 'Rendering elements based on condition', explanation: 'Conditional rendering renders UI dynamically.' },
    { question: 'What is React Fragment shorthand syntax?', options: ['<fragment></fragment>', '<></>', '<div fragment>', '<block></block>'], correctAnswer: '<></>', explanation: '<></> groups elements without extra DOM node.' },
    { question: 'Which package is standard for routing in React web apps?', options: ['react-navigation', 'react-router-dom', 'next-router', 'express-router'], correctAnswer: 'react-router-dom', explanation: 'react-router-dom is used for web routing.' },
    { question: 'What is controlled component in React forms?', options: ['Form element driven by React state', 'Unmanaged input', 'Backend validated form', 'Disabled input'], correctAnswer: 'Form element driven by React state', explanation: 'State controls input value.' },
    { question: 'What hook is used to dispatch actions in Redux Toolkit with React?', options: ['useSelector', 'useDispatch', 'useStore', 'useRedux'], correctAnswer: 'useDispatch', explanation: 'useDispatch dispatches Redux actions.' }
  ]
};

async function seedQuestionBanks() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Starting question bank seeding...');

  for (const skillName of Object.keys(initialQuestionBanks)) {
    let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${skillName}$`, 'i') } });
    if (!skill) {
      skill = await Skill.create({
        name: skillName,
        category: skillName === 'Python' ? 'Data & AI' : 'Development',
        status: 'active'
      });
      console.log(`Created Master Skill: ${skill.name}`);
    }

    const qList = initialQuestionBanks[skillName];
    for (const item of qList) {
      const existingQ = await SkillQuestion.findOne({ skill: skill._id, question: item.question });
      if (!existingQ) {
        await SkillQuestion.create({
          skill: skill._id,
          skillName: skill.name,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          difficulty: 'Basic',
          isActive: true
        });
      }
    }
    const count = await SkillQuestion.countDocuments({ skill: skill._id });
    console.log(`✔ ${skill.name} Question Bank ready with ${count} active questions.`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seedQuestionBanks().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
