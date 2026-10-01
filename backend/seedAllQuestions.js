const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');

const comprehensiveQuestions = {
  'JavaScript & React': [
    { question: 'Which keyword declares a block-scoped constant variable in JavaScript?', options: ['var', 'let', 'const', 'static'], correctAnswer: 'const' },
    { question: 'Which hook manages state in a React functional component?', options: ['useEffect', 'useState', 'useRef', 'useContext'], correctAnswer: 'useState' },
    { question: 'What syntax allows writing HTML-like code inside React JavaScript?', options: ['JSX', 'HTMLX', 'TSX', 'XML'], correctAnswer: 'JSX' },
    { question: 'Which array method creates a new array by transforming every element in JavaScript?', options: ['map()', 'filter()', 'forEach()', 'reduce()'], correctAnswer: 'map()' },
    { question: 'How do you pass read-only data from a parent to a child component in React?', options: ['State', 'Props', 'Redux', 'Context'], correctAnswer: 'Props' },
    { question: 'Which operator performs strict equality and type checking in JavaScript?', options: ['==', '===', '=', 'equals'], correctAnswer: '===' },
    { question: 'Which hook handles side effects like fetching data in React?', options: ['useState', 'useEffect', 'useMemo', 'useCallback'], correctAnswer: 'useEffect' },
    { question: 'What method parses a JSON string into a JavaScript object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toObj()', 'JSON.convert()'], correctAnswer: 'JSON.parse()' },
    { question: 'What attribute provides unique identity for elements rendered in a React list?', options: ['key', 'id', 'ref', 'index'], correctAnswer: 'key' },
    { question: 'Which keyword defines an asynchronous function in JavaScript?', options: ['async', 'defer', 'promise', 'sync'], correctAnswer: 'async' },
    { question: 'What does Event.preventDefault() do in React form handling?', options: ['Prevents default browser form submission', 'Stops React rendering', 'Clears input fields', 'Reloads page'], correctAnswer: 'Prevents default browser form submission' },
    { question: 'Which array method adds elements to the end of an array in JavaScript?', options: ['push()', 'pop()', 'unshift()', 'shift()'], correctAnswer: 'push()' },
    { question: 'Which hook accesses Context API data in React?', options: ['useContext', 'useState', 'useRef', 'useReducer'], correctAnswer: 'useContext' },
    { question: 'What is the type of NaN in JavaScript?', options: ['number', 'undefined', 'null', 'string'], correctAnswer: 'number' },
    { question: 'Which hook creates a persistent mutable reference object in React?', options: ['useRef', 'useState', 'useMemo', 'useEffect'], correctAnswer: 'useRef' },
    { question: 'Which method combines array elements into a string in JavaScript?', options: ['join()', 'concat()', 'slice()', 'split()'], correctAnswer: 'join()' },
    { question: 'What shorthand syntax renders adjacent React elements without a wrapping DOM node?', options: ['<></>', '<div />', '<block></block>', '<fragment />'], correctAnswer: '<></>' },
    { question: 'Which keyword pauses async function execution until a Promise settles?', options: ['await', 'wait', 'defer', 'hold'], correctAnswer: 'await' },
    { question: 'What tool bundles modern React applications rapidly?', options: ['Vite', 'Babel', 'Gulp', 'Grunt'], correctAnswer: 'Vite' },
    { question: 'What is the default unassigned variable value in JavaScript?', options: ['undefined', 'null', '0', 'false'], correctAnswer: 'undefined' }
  ],

  'Python for Data Science': [
    { question: 'Which Python library is primary for numerical arrays and matrix operations?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Requests'], correctAnswer: 'NumPy' },
    { question: 'Which Python library provides DataFrames for tabular data analysis?', options: ['Pandas', 'SciPy', 'Seaborn', 'Flask'], correctAnswer: 'Pandas' },
    { question: 'Which method reads a CSV file into a Pandas DataFrame?', options: ['pd.read_csv()', 'pd.open_csv()', 'pd.load_csv()', 'pd.csv()'], correctAnswer: 'pd.read_csv()' },
    { question: 'Which symbol is used for comments in Python?', options: ['#', '//', '/*', '<!--'], correctAnswer: '#' },
    { question: 'Which keyword defines a function in Python?', options: ['def', 'func', 'function', 'define'], correctAnswer: 'def' },
    { question: 'What is the first index of a Python list or Pandas series?', options: ['0', '1', '-1', 'None'], correctAnswer: '0' },
    { question: 'Which function returns the number of rows or elements in a list/series?', options: ['len()', 'size()', 'count()', 'length()'], correctAnswer: 'len()' },
    { question: 'Which Pandas attribute inspects DataFrame dimensions (rows, columns)?', options: ['shape', 'dimensions', 'size', 'info'], correctAnswer: 'shape' },
    { question: 'Which Python library is used for creating static data visualizations and plots?', options: ['Matplotlib', 'Django', 'SQLAlchemy', 'BeautifulSoup'], correctAnswer: 'Matplotlib' },
    { question: 'Which data structure stores immutable ordered items in Python?', options: ['Tuple', 'List', 'Set', 'Dictionary'], correctAnswer: 'Tuple' },
    { question: 'Which method drops missing NaN values from a Pandas DataFrame?', options: ['dropna()', 'remove_null()', 'clean()', 'delete_na()'], correctAnswer: 'dropna()' },
    { question: 'Which method fills missing NaN values with a default value in Pandas?', options: ['fillna()', 'replace_na()', 'set_na()', 'inputna()'], correctAnswer: 'fillna()' },
    { question: 'Which operator calculates exponentiation (power) in Python?', options: ['**', '^', 'pow', '//'], correctAnswer: '**' },
    { question: 'Which Pandas method summarizes statistical info (mean, std, min, max)?', options: ['describe()', 'summary()', 'stats()', 'info()'], correctAnswer: 'describe()' },
    { question: 'What data structure stores key-value pairs in Python?', options: ['Dictionary', 'List', 'Tuple', 'Set'], correctAnswer: 'Dictionary' },
    { question: 'Which Pandas method selects data by integer position index?', options: ['iloc[]', 'loc[]', 'at[]', 'get()'], correctAnswer: 'iloc[]' },
    { question: 'Which method selects DataFrame data by label or boolean array in Pandas?', options: ['loc[]', 'iloc[]', 'find[]', 'select[]'], correctAnswer: 'loc[]' },
    { question: 'Which method groups data by column values in Pandas?', options: ['groupby()', 'aggregate()', 'cluster()', 'categorize()'], correctAnswer: 'groupby()' },
    { question: 'Which function creates an array of evenly spaced numbers in NumPy?', options: ['np.arange()', 'np.create()', 'np.series()', 'np.list()'], correctAnswer: 'np.arange()' },
    { question: 'Which Python operator performs floor division?', options: ['//', '/', '%', 'div'], correctAnswer: '//' }
  ],

  'UI/UX Design in Figma': [
    { question: 'What feature in Figma automatically adjusts layout margins and spacing when components change?', options: ['Auto Layout', 'Grid System', 'Smart Animate', 'Constraints'], correctAnswer: 'Auto Layout' },
    { question: 'What is a master visual element that can be reused across screens in Figma?', options: ['Component', 'Frame', 'Group', 'Vector'], correctAnswer: 'Component' },
    { question: 'What represents an instance copy of a master Component in Figma?', options: ['Component Instance', 'Duplicated Frame', 'Layer Variant', 'Style Item'], correctAnswer: 'Component Instance' },
    { question: 'What Figma tool feature connects screens together to simulate interactive app flow?', options: ['Prototyping', 'Auto Layout', 'Vector Network', 'Inspect'], correctAnswer: 'Prototyping' },
    { question: 'What feature groups multiple variations of a component (e.g. Primary, Secondary, Hover) together?', options: ['Variants', 'Frames', 'Auto Layout', 'Plugins'], correctAnswer: 'Variants' },
    { question: 'What container frame is used to wrap screen designs in Figma?', options: ['Frame', 'Group', 'Rectangle', 'Canvas'], correctAnswer: 'Frame' },
    { question: 'What is the primary shortcut to select the Frame tool in Figma?', options: ['F', 'R', 'V', 'T'], correctAnswer: 'F' },
    { question: 'What feature defines how child elements resize when parent frames resize in Figma?', options: ['Constraints', 'Auto Spacing', 'Fixed Layout', 'Smart Resize'], correctAnswer: 'Constraints' },
    { question: 'What tool allows drawing custom vector paths and icons in Figma?', options: ['Pen Tool (P)', 'Pencil Tool', 'Shape Tool', 'Slice Tool'], correctAnswer: 'Pen Tool (P)' },
    { question: 'What is the difference between UI and UX design?', options: ['UI is visual interface; UX is user experience and journey', 'UI is backend; UX is frontend', 'UI is research; UX is typography', 'They are identical terms'], correctAnswer: 'UI is visual interface; UX is user experience and journey' },
    { question: 'What design system asset maintains consistent colors and typography in Figma?', options: ['Styles', 'Plugins', 'Smart Animate', 'Masks'], correctAnswer: 'Styles' },
    { question: 'What feature masks content inside a shape boundaries in Figma?', options: ['Use as Mask', 'Clip Content', 'Crop Frame', 'Subtract Selection'], correctAnswer: 'Use as Mask' },
    { question: 'What transition animation automatically interpolates matching layers between frames in Figma?', options: ['Smart Animate', 'Instant', 'Dissolve', 'Push'], correctAnswer: 'Smart Animate' },
    { question: 'What shortcut opens the Figma text tool?', options: ['T', 'X', 'A', 'P'], correctAnswer: 'T' },
    { question: 'What is a low-fidelity visual draft of a digital interface called?', options: ['Wireframe', 'High-res Prototype', 'Design System', 'Final Handout'], correctAnswer: 'Wireframe' },
    { question: 'What feature clips overflow content outside a frame boundaries in Figma?', options: ['Clip Content', 'Auto Crop', 'Mask Layer', 'Hide Border'], correctAnswer: 'Clip Content' },
    { question: 'What tool in Figma enables team members to leave visual comments on designs?', options: ['Comment Tool (C)', 'Chat Plugin', 'Inspect Tab', 'Notes Layer'], correctAnswer: 'Comment Tool (C)' },
    { question: 'What panel displays design CSS properties and specs for developers in Figma?', options: ['Dev Mode / Inspect', 'Layers Panel', 'Assets Panel', 'Prototype Panel'], correctAnswer: 'Dev Mode / Inspect' },
    { question: 'What is a visual palette containing typography, color, and spacing guidelines called?', options: ['Design System', 'Wireframe', 'Flowchart', 'Storyboards'], correctAnswer: 'Design System' },
    { question: 'What shortcut duplicates selected elements in Figma?', options: ['Ctrl+D / Cmd+D', 'Ctrl+C', 'Ctrl+Shift+D', 'Alt+D'], correctAnswer: 'Ctrl+D / Cmd+D' }
  ],

  'Digital Marketing & SEO': [
    { question: 'What does SEO stand for in digital marketing?', options: ['Search Engine Optimization', 'Social Engine Organization', 'Search Execution Order', 'System Electronic Operation'], correctAnswer: 'Search Engine Optimization' },
    { question: 'What type of marketing model charges advertisers only when users click an ad?', options: ['PPC (Pay-Per-Click)', 'CPM (Cost Per Mille)', 'SEO', 'Email Marketing'], correctAnswer: 'PPC (Pay-Per-Click)' },
    { question: 'Which metric measures the percentage of visitors who leave a site after viewing only one page?', options: ['Bounce Rate', 'Conversion Rate', 'CTR', 'Impression Share'], correctAnswer: 'Bounce Rate' },
    { question: 'Which Google tool tracks website traffic, user acquisition, and visitor metrics?', options: ['Google Analytics', 'Google Ads', 'Google Trends', 'Google Search Console'], correctAnswer: 'Google Analytics' },
    { question: 'What HTML tag specifies the main title of a web page displayed in search result snippets?', options: ['<title>', '<h1>', '<meta name="description">', '<header>'], correctAnswer: '<title>' },
    { question: 'What metric represents the percentage of ad impressions that result in a click?', options: ['CTR (Click-Through Rate)', 'Conversion Rate', 'ROI', 'CPC'], correctAnswer: 'CTR (Click-Through Rate)' },
    { question: 'Which Google tool helps webmasters monitor indexing, sitemaps, and search queries?', options: ['Google Search Console', 'Google Data Studio', 'Google Tag Manager', 'Google AdSense'], correctAnswer: 'Google Search Console' },
    { question: 'What is organic traffic in digital marketing?', options: ['Visitors coming from unpaid search engine results', 'Paid ad clicks', 'Social media ad traffic', 'Direct email links'], correctAnswer: 'Visitors coming from unpaid search engine results' },
    { question: 'What is a target phrase users type into search engines called?', options: ['Keyword', 'Meta Tag', 'Anchor Text', 'Slug'], correctAnswer: 'Keyword' },
    { question: 'What attribute provides alternative text for images to assist search engines and accessibility?', options: ['alt', 'title', 'desc', 'src'], correctAnswer: 'alt' },
    { question: 'What is the process of acquiring hyperlinks from other websites to your own called?', options: ['Link Building', 'Social Sharing', 'Keyword Stuffing', 'Ad Retargeting'], correctAnswer: 'Link Building' },
    { question: 'What metric measures the cost incurred for each desired customer action (e.g. sale, lead)?', options: ['CPA (Cost Per Acquisition)', 'CPC', 'CPM', 'ROAS'], correctAnswer: 'CPA (Cost Per Acquisition)' },
    { question: 'What is the practice of filling web pages with excessive keywords to manipulate search ranking called?', options: ['Keyword Stuffing', 'On-Page SEO', 'White Hat SEO', 'Canonicalization'], correctAnswer: 'Keyword Stuffing' },
    { question: 'What file instructs search engine crawlers which pages to crawl or avoid?', options: ['robots.txt', 'sitemap.xml', 'index.html', '.htaccess'], correctAnswer: 'robots.txt' },
    { question: 'What XML file provides a map of all website URLs to search engine indexers?', options: ['sitemap.xml', 'robots.txt', 'schema.json', 'urls.txt'], correctAnswer: 'sitemap.xml' },
    { question: 'What type of marketing uses social media platforms like Instagram & LinkedIn to build brand presence?', options: ['SMM (Social Media Marketing)', 'SEO', 'Affiliate Marketing', 'Cold Calling'], correctAnswer: 'SMM (Social Media Marketing)' },
    { question: 'What metric calculates financial return generated relative to marketing campaign cost?', options: ['ROI (Return on Investment)', 'CTR', 'CPM', 'Bounce Rate'], correctAnswer: 'ROI (Return on Investment)' },
    { question: 'What HTML meta tag provides a short summary of a web page in search snippets?', options: ['<meta name="description">', '<meta name="keywords">', '<title>', '<head>'], correctAnswer: '<meta name="description">' },
    { question: 'What marketing strategy shows ads to users who previously visited your website?', options: ['Remarketing / Retargeting', 'Outbound Sales', 'Influencer Marketing', 'Native Content'], correctAnswer: 'Remarketing / Retargeting' },
    { question: 'What is the clickable text in a hyperlink called?', options: ['Anchor Text', 'Alt Tag', 'Canonical Link', 'Permalink'], correctAnswer: 'Anchor Text' }
  ],

  'Public Speaking & Presentation': [
    { question: 'What is the recommended body language posture during a formal public presentation?', options: ['Open, relaxed stance with good eye contact', 'Crossed arms looking at floor', 'Pacing rapidly across stage', 'Reading directly from slides with back turned'], correctAnswer: 'Open, relaxed stance with good eye contact' },
    { question: 'What is the primary purpose of an opening "hook" in a presentation?', options: ['Grab audience attention immediately', 'Introduce speaker qualifications', 'Summarize Q&A section', 'Display slide table of contents'], correctAnswer: 'Grab audience attention immediately' },
    { question: 'What rule suggests using visual slides as support rather than full text scripts?', options: ['Keep slides concise with key visual aids', 'Write full paragraphs on slides', 'Use 100+ slides per presentation', 'Avoid pictures completely'], correctAnswer: 'Keep slides concise with key visual aids' },
    { question: 'What technique involves adjusting vocal pitch, volume, and pace to keep listeners engaged?', options: ['Vocal Variety', 'Monotone Delivery', 'Lip Syncing', 'Speed Talking'], correctAnswer: 'Vocal Variety' },
    { question: 'How can a speaker effectively manage public speaking anxiety or stage fright?', options: ['Deep breathing, preparation, and positive visualization', 'Avoiding eye contact', 'Rushing through slides', 'Memorizing word for word without practice'], correctAnswer: 'Deep breathing, preparation, and positive visualization' },
    { question: 'What is the strategic use of silence during a speech called?', options: ['Pause', 'Stutter', 'Filler word', 'Lapse'], correctAnswer: 'Pause' },
    { question: 'What are words like "um", "ah", "like", and "you know" called in public speaking?', options: ['Filler words', 'Anchor phrases', 'Transition cues', 'Vocal pitch'], correctAnswer: 'Filler words' },
    { question: 'What is the 10-20-30 rule of PowerPoint presentations popularized by Guy Kawasaki?', options: ['10 slides, 20 minutes, 30 point font size', '10 topics, 20 speakers, 30 slides', '10 minutes, 20 slides, 30 animations', '10 pages, 20 words, 30 images'], correctAnswer: '10 slides, 20 minutes, 30 point font size' },
    { question: 'What should a presenter do when asked a question during Q&A that they do not know the answer to?', options: ['Acknowledge honestly and offer to follow up later', 'Make up an answer', 'Ignore the questioner', 'Argue with audience'], correctAnswer: 'Acknowledge honestly and offer to follow up later' },
    { question: 'What method involves making direct eye contact with different individuals across the room?', options: ['Sweeping or scanning eye contact', 'Staring at ceiling', 'Looking only at slides', 'Focusing on clock'], correctAnswer: 'Sweeping or scanning eye contact' },
    { question: 'What structure orders a speech effectively?', options: ['Introduction (Hook), Body (Key Points), Conclusion (Call to Action)', 'Random stories', 'Q&A first, slides second', 'Body only'], correctAnswer: 'Introduction (Hook), Body (Key Points), Conclusion (Call to Action)' },
    { question: 'What is the term for adapting presentation tone and depth to suit your audience?', options: ['Audience Analysis', 'Stage Blocking', 'Script Reading', 'Slide Formatting'], correctAnswer: 'Audience Analysis' },
    { question: 'What movement technique uses purposeful physical steps on stage to transition between topics?', options: ['Stage Movement / Triangle Walk', 'Fidgeting', 'Backing away', 'Pacing randomly'], correctAnswer: 'Stage Movement / Triangle Walk' },
    { question: 'What visual aid contrast rule ensures text is readable from afar?', options: ['High contrast between text and background', 'Yellow text on white background', 'Dark text on dark background', 'Small font size'], correctAnswer: 'High contrast between text and background' },
    { question: 'What is spontaneous speaking without prior preparation called?', options: ['Impromptu Speaking', 'Extemporaneous Speech', 'Manuscript Delivery', 'Memorized Speech'], correctAnswer: 'Impromptu Speaking' },
    { question: 'What is a presentation delivery method using outline notes rather than full scripts?', options: ['Extemporaneous Delivery', 'Manuscript Reading', 'Impromptu Speech', 'Robotic Reading'], correctAnswer: 'Extemporaneous Delivery' },
    { question: 'What should a conclusion of a persuasive speech include?', options: ['Clear summary and strong Call to Action', 'Introduction of new complex data', 'Apologies for time', 'Silent exit'], correctAnswer: 'Clear summary and strong Call to Action' },
    { question: 'How should hands be positioned when not gesturing during a speech?', options: ['Resting naturally at waist level or at sides', 'Stuffed inside pockets', 'Clasping tightly behind back', 'Waving frantically'], correctAnswer: 'Resting naturally at waist level or at sides' },
    { question: 'What is the effect of speaking too fast during a presentation?', options: ['Audience loses comprehension and clarity', 'Higher engagement', 'Better memory retention', 'Saves slide animation'], correctAnswer: 'Audience loses comprehension and clarity' },
    { question: 'What is the best way to build confidence before a presentation?', options: ['Rehearsing out loud multiple times', 'Wing it on stage', 'Changing slides at last minute', 'Reading script silently'], correctAnswer: 'Rehearsing out loud multiple times' }
  ],

  'Java': [
    { question: 'Which keyword is used to define a class in Java?', options: ['class', 'struct', 'define', 'object'], correctAnswer: 'class' },
    { question: 'What is the entry point method signature for a Java application?', options: ['public static void main(String[] args)', 'void main()', 'public void start()', 'static main(String args)'], correctAnswer: 'public static void main(String[] args)' },
    { question: 'Which keyword is used for class inheritance in Java?', options: ['extends', 'implements', 'inherits', 'super'], correctAnswer: 'extends' },
    { question: 'Which keyword implements an interface in Java?', options: ['implements', 'extends', 'uses', 'interface'], correctAnswer: 'implements' },
    { question: 'What is the size of an int data type in Java?', options: ['32 bits (4 bytes)', '16 bits', '64 bits', '8 bits'], correctAnswer: '32 bits (4 bytes)' },
    { question: 'Which memory area stores objects and instance variables in Java?', options: ['Heap Memory', 'Stack Memory', 'Method Area', 'Register'], correctAnswer: 'Heap Memory' },
    { question: 'Which memory area stores local variables and method call frames in Java?', options: ['Stack Memory', 'Heap Memory', 'Disk', 'Cache'], correctAnswer: 'Stack Memory' },
    { question: 'What keyword refers to the current object instance inside a class in Java?', options: ['this', 'self', 'super', 'me'], correctAnswer: 'this' },
    { question: 'Which keyword calls the superclass constructor in Java?', options: ['super()', 'this()', 'parent()', 'base()'], correctAnswer: 'super()' },
    { question: 'Which access modifier makes a class member accessible only within its own class?', options: ['private', 'public', 'protected', 'default'], correctAnswer: 'private' },
    { question: 'Which access modifier allows access within same package and subclasses?', options: ['protected', 'private', 'public', 'package'], correctAnswer: 'protected' },
    { question: 'What feature automatically reclaims unused object memory in Java?', options: ['Garbage Collection', 'Deconstructor', 'Free()', 'Memory Clean'], correctAnswer: 'Garbage Collection' },
    { question: 'Which keyword defines a constant variable in Java?', options: ['final', 'const', 'static', 'fixed'], correctAnswer: 'final' },
    { question: 'What Exception is thrown when dereferencing a null object reference in Java?', options: ['NullPointerException', 'IllegalArgumentException', 'ClassNotFoundException', 'IOException'], correctAnswer: 'NullPointerException' },
    { question: 'Which Java Collection class implements a dynamic growable array?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], correctAnswer: 'ArrayList' },
    { question: 'Which Collection interface stores key-value pairs in Java?', options: ['Map', 'Set', 'List', 'Queue'], correctAnswer: 'Map' },
    { question: 'What does JVM stand for?', options: ['Java Virtual Machine', 'Java Variable Memory', 'Java Vector Model', 'Java Visual Mode'], correctAnswer: 'Java Virtual Machine' },
    { question: 'Which keyword is used to handle exceptions in Java?', options: ['try / catch / finally', 'try / except', 'do / catch', 'handle / catch'], correctAnswer: 'try / catch / finally' },
    { question: 'What is method overloading in Java?', options: ['Methods in same class with same name but different parameters', 'Redefining parent method in child', 'Multiple main methods', 'Static method call'], correctAnswer: 'Methods in same class with same name but different parameters' },
    { question: 'What is method overriding in Java?', options: ['Redefining a superclass method in a subclass with same signature', 'Same class multiple methods', 'Private method call', 'Constructor chaining'], correctAnswer: 'Redefining a superclass method in a subclass with same signature' }
  ],

  'C++': [
    { question: 'Which header file is included for standard input/output streams in C++?', options: ['<iostream>', '<stdio.h>', '<stream>', '<conio.h>'], correctAnswer: '<iostream>' },
    { question: 'Which operator is used to print output to standard stream in C++?', options: ['<<', '>>', '::', '->'], correctAnswer: '<<' },
    { question: 'Which operator is used to read input from std::cin in C++?', options: ['>>', '<<', '&', '.*'], correctAnswer: '>>' },
    { question: 'Which keyword allocates dynamic memory on heap in C++?', options: ['new', 'malloc', 'alloc', 'create'], correctAnswer: 'new' },
    { question: 'Which operator deallocates dynamic memory created with new in C++?', options: ['delete', 'free', 'destruct', 'remove'], correctAnswer: 'delete' },
    { question: 'What symbol represents a pointer variable declaration in C++?', options: ['*', '&', '->', '#'], correctAnswer: '*' },
    { question: 'What symbol is the address-of operator in C++?', options: ['&', '*', '::', '->'], correctAnswer: '&' },
    { question: 'What is a member function called that has the same name as the class and initializes objects?', options: ['Constructor', 'Destructor', 'Virtual method', 'Initializer'], correctAnswer: 'Constructor' },
    { question: 'What symbol precedes a destructor function in C++?', options: ['~', '!', '#', '^'], correctAnswer: '~' },
    { question: 'Which scope resolution operator is used to access class or namespace members in C++?', options: ['::', ':', '->', '.'], correctAnswer: '::' },
    { question: 'What operator accesses members of an object through a pointer in C++?', options: ['->', '.', '::', '.*'], correctAnswer: '->' },
    { question: 'Which keyword allows polymorphism through base class pointers in C++?', options: ['virtual', 'override', 'abstract', 'polymorphic'], correctAnswer: 'virtual' },
    { question: 'What does STL stand for in C++?', options: ['Standard Template Library', 'System Type Library', 'Static Target Language', 'Single Thread Logic'], correctAnswer: 'Standard Template Library' },
    { question: 'Which STL container implements a dynamic contiguous array in C++?', options: ['std::vector', 'std::list', 'std::map', 'std::deque'], correctAnswer: 'std::vector' },
    { question: 'Which keyword creates generic functions or classes in C++?', options: ['template', 'generic', 'type', 'typename'], correctAnswer: 'template' },
    { question: 'What value represents a null pointer literal in C++11 and modern C++?', options: ['nullptr', 'NULL', '0', 'void'], correctAnswer: 'nullptr' },
    { question: 'Which access specifier makes class members accessible everywhere?', options: ['public', 'private', 'protected', 'friend'], correctAnswer: 'public' },
    { question: 'What keyword grants a non-member function access to private members of a class in C++?', options: ['friend', 'public', 'grant', 'allow'], correctAnswer: 'friend' },
    { question: 'What method returns the element count of a std::vector in C++?', options: ['size()', 'length()', 'count()', 'capacity()'], correctAnswer: 'size()' },
    { question: 'What keyword is used to handle exceptions in C++?', options: ['try / catch / throw', 'try / except', 'do / catch', 'raise / catch'], correctAnswer: 'try / catch / throw' }
  ],

  'Python': [
    { question: 'Which keyword is used to import a library in Python?', options: ['import', 'include', 'require', 'using'], correctAnswer: 'import' },
    { question: 'What data type is used for key-value mappings in Python?', options: ['dict', 'list', 'tuple', 'set'], correctAnswer: 'dict' },
    { question: 'Which function prints output to the console in Python?', options: ['print()', 'echo()', 'console.log()', 'printf()'], correctAnswer: 'print()' },
    { question: 'Which symbol starts a single-line comment in Python?', options: ['#', '//', '/*', '--'], correctAnswer: '#' },
    { question: 'Which keyword defines a function in Python?', options: ['def', 'func', 'function', 'create'], correctAnswer: 'def' },
    { question: 'How do you create an empty list in Python?', options: ['[]', '{}', '()', '<>'], correctAnswer: '[]' },
    { question: 'What function returns the length of a string or list in Python?', options: ['len()', 'length()', 'size()', 'count()'], correctAnswer: 'len()' },
    { question: 'Which keyword creates a loop over an iterable sequence in Python?', options: ['for', 'foreach', 'loop', 'repeat'], correctAnswer: 'for' },
    { question: 'What is the boolean true value representation in Python?', options: ['True', 'true', 'TRUE', '1'], correctAnswer: 'True' },
    { question: 'Which operator raises a number to a power in Python?', options: ['**', '^', 'pow', '//'], correctAnswer: '**' },
    { question: 'What method appends an item to the end of a list in Python?', options: ['append()', 'add()', 'push()', 'insert()'], correctAnswer: 'append()' },
    { question: 'What data structure is immutable in Python?', options: ['Tuple', 'List', 'Dictionary', 'Set'], correctAnswer: 'Tuple' },
    { question: 'Which keyword handles exceptions in Python?', options: ['except', 'catch', 'trap', 'handle'], correctAnswer: 'except' },
    { question: 'What operator performs floor integer division in Python?', options: ['//', '/', '%', 'div'], correctAnswer: '//' },
    { question: 'Which built-in function converts a string to an integer in Python?', options: ['int()', 'str()', 'float()', 'parse()'], correctAnswer: 'int()' },
    { question: 'Which keyword is used to define a class in Python?', options: ['class', 'struct', 'object', 'type'], correctAnswer: 'class' },
    { question: 'What method splits a string into a list of words in Python?', options: ['split()', 'slice()', 'cut()', 'divide()'], correctAnswer: 'split()' },
    { question: 'Which operator checks equality between two values in Python?', options: ['==', '=', '===', 'is'], correctAnswer: '==' },
    { question: 'What special parameter represents the current instance inside a class method in Python?', options: ['self', 'this', 'me', 'instance'], correctAnswer: 'self' },
    { question: 'Which statement immediately exits a loop in Python?', options: ['break', 'continue', 'exit', 'stop'], correctAnswer: 'break' }
  ],

  'JavaScript': [
    { question: 'Which built-in object handles mathematical calculations in JavaScript?', options: ['Math', 'Calc', 'Number', 'System'], correctAnswer: 'Math' },
    { question: 'Which array method transforms every element and returns a new array in JS?', options: ['map()', 'filter()', 'forEach()', 'reduce()'], correctAnswer: 'map()' },
    { question: 'Which keyword declares a variable that can be reassigned in JS?', options: ['let', 'const', 'static', 'val'], correctAnswer: 'let' },
    { question: 'What keyword defines an anonymous inline function arrow syntax in JS?', options: ['=>', '->', 'function', 'def'], correctAnswer: '=>' },
    { question: 'Which operator checks both value and type equality in JS?', options: ['===', '==', '=', 'eq'], correctAnswer: '===' },
    { question: 'How do you write a single-line comment in JavaScript?', options: ['//', '#', '/*', '<!--'], correctAnswer: '//' },
    { question: 'What function displays a pop-up alert dialog box in the browser?', options: ['alert()', 'popup()', 'msg()', 'prompt()'], correctAnswer: 'alert()' },
    { question: 'Which array method removes the last element from an array in JS?', options: ['pop()', 'push()', 'shift()', 'slice()'], correctAnswer: 'pop()' },
    { question: 'What global object represents the browser window in client-side JS?', options: ['window', 'document', 'navigator', 'global'], correctAnswer: 'window' },
    { question: 'Which keyword handles promises asynchronously in modern JS?', options: ['async/await', 'defer/then', 'wait/hold', 'thread'], correctAnswer: 'async/await' },
    { question: 'What operator converts a JS object to a JSON string?', options: ['JSON.stringify()', 'JSON.parse()', 'Object.toJSON()', 'String.json()'], correctAnswer: 'JSON.stringify()' },
    { question: 'Which array method filters elements based on a condition in JS?', options: ['filter()', 'map()', 'find()', 'search()'], correctAnswer: 'filter()' },
    { question: 'What is the return type of typeof [] in JavaScript?', options: ['object', 'array', 'list', 'vector'], correctAnswer: 'object' },
    { question: 'What event fires when an HTML input element value changes in JS?', options: ['change', 'click', 'submit', 'hover'], correctAnswer: 'change' },
    { question: 'Which keyword stops execution and returns a value from a JS function?', options: ['return', 'stop', 'yield', 'exit'], correctAnswer: 'return' },
    { question: 'Which method adds elements to the beginning of an array in JS?', options: ['unshift()', 'push()', 'prepend()', 'first()'], correctAnswer: 'unshift()' },
    { question: 'What is the default global object in Node.js?', options: ['global', 'window', 'process', 'root'], correctAnswer: 'global' },
    { question: 'What method cancels timer execution set by setTimeout() in JS?', options: ['clearTimeout()', 'stopTimeout()', 'cancelTimer()', 'resetTimeout()'], correctAnswer: 'clearTimeout()' },
    { question: 'Which keyword creates an instance of an object from a constructor function in JS?', options: ['new', 'create', 'make', 'instance'], correctAnswer: 'new' },
    { question: 'What operator spreads elements of an array or object in JS?', options: ['...', '***', ':::', '&&&'], correctAnswer: '...' }
  ],

  'React': [
    { question: 'Which hook manages component state in a React functional component?', options: ['useState', 'useEffect', 'useContext', 'useRef'], correctAnswer: 'useState' },
    { question: 'What is the term for passing data into React components?', options: ['Props', 'State', 'Context', 'Redux'], correctAnswer: 'Props' },
    { question: 'Which hook replaces lifecycle methods like componentDidMount in React?', options: ['useEffect', 'useState', 'useMemo', 'useLayout'], correctAnswer: 'useEffect' },
    { question: 'What is JSX in React?', options: ['JavaScript XML syntax extension', 'JSON Style eXtension', 'Java Server Extension', 'Joint Styling XML'], correctAnswer: 'JavaScript XML syntax extension' },
    { question: 'Which prop is required when rendering dynamic lists in React?', options: ['key', 'id', 'index', 'ref'], correctAnswer: 'key' },
    { question: 'How do you create a controlled form input in React?', options: ['Bind value to state and update on onChange', 'Use HTML form submit', 'Use document.getElementById()', 'Use window.input'], correctAnswer: 'Bind value to state and update on onChange' },
    { question: 'Which hook provides access to React Context API values?', options: ['useContext', 'useState', 'useRef', 'useReducer'], correctAnswer: 'useContext' },
    { question: 'What feature memoizes expensive calculations between renders in React?', options: ['useMemo', 'useCallback', 'useState', 'useEffect'], correctAnswer: 'useMemo' },
    { question: 'Which component type is recommended in modern React development?', options: ['Functional Components with Hooks', 'Class Components', 'EJS Templates', 'Handlebars Views'], correctAnswer: 'Functional Components with Hooks' },
    { question: 'What hook memoizes callback function instances between renders in React?', options: ['useCallback', 'useMemo', 'useRef', 'useEffect'], correctAnswer: 'useCallback' },
    { question: 'What DOM implementation does React use for fast UI updates?', options: ['Virtual DOM', 'Shadow DOM', 'Real DOM', 'Canvas DOM'], correctAnswer: 'Virtual DOM' },
    { question: 'Which hook creates a reference to a DOM node in React?', options: ['useRef', 'useState', 'useEffect', 'useDom'], correctAnswer: 'useRef' },
    { question: 'What tool can bootstrap a React project fast?', options: ['Vite', 'Webpack', 'Gulp', 'Babel'], correctAnswer: 'Vite' },
    { question: 'How do you render content conditionally in React JSX?', options: ['Ternary operator or logical && operator', 'if/else inside JSX tags', 'switch/case inside JSX tags', 'goto statements'], correctAnswer: 'Ternary operator or logical && operator' },
    { question: 'Which method catches render errors in React error boundary components?', options: ['componentDidCatch', 'useEffect', 'useState', 'renderError'], correctAnswer: 'componentDidCatch' },
    { question: 'What function updates state created by const [val, setVal] = useState(0)?', options: ['setVal()', 'updateVal()', 'val()', 'changeVal()'], correctAnswer: 'setVal()' },
    { question: 'What happens when state changes in a React component?', options: ['The component re-renders', 'The page reloads', 'Database resets', 'Props are deleted'], correctAnswer: 'The component re-renders' },
    { question: 'What wrapper allows grouping multiple elements without extra DOM node?', options: ['<React.Fragment>', '<div>', '<section>', '<span>'], correctAnswer: '<React.Fragment>' },
    { question: 'What library is commonly used for client-side routing in React?', options: ['React Router', 'Express', 'Axios', 'Redux'], correctAnswer: 'React Router' },
    { question: 'What package executes HTTP requests easily in React apps?', options: ['Axios', 'Express', 'Nodemon', 'Mongoose'], correctAnswer: 'Axios' }
  ],

  'Node.js': [
    { question: 'What engine executes JavaScript code in Node.js?', options: ['V8 Engine', 'SpiderMonkey', 'Chakra', 'JavaScriptCore'], correctAnswer: 'V8 Engine' },
    { question: 'Which core module builds web servers in Node.js?', options: ['http', 'fs', 'path', 'url'], correctAnswer: 'http' },
    { question: 'Which global variable provides current directory path in Node.js?', options: ['__dirname', '__filename', 'process.cwd', 'dir'], correctAnswer: '__dirname' },
    { question: 'Which command initializes a package.json file for Node.js projects?', options: ['npm init', 'node start', 'npm create', 'node init'], correctAnswer: 'npm init' },
    { question: 'Which package manager is built into Node.js by default?', options: ['npm', 'yarn', 'pnpm', 'bower'], correctAnswer: 'npm' },
    { question: 'Which framework simplifies routing and middleware in Node.js?', options: ['Express.js', 'React', 'Vue', 'Angular'], correctAnswer: 'Express.js' },
    { question: 'Which core module reads and writes files in Node.js?', options: ['fs', 'path', 'stream', 'buffer'], correctAnswer: 'fs' },
    { question: 'How do you import CommonJS modules in Node.js?', options: ['require()', 'import', 'include()', 'load()'], correctAnswer: 'require()' },
    { question: 'Which object provides environment variables in Node.js?', options: ['process.env', 'global.env', 'env.config', 'system.env'], correctAnswer: 'process.env' },
    { question: 'What architecture enables non-blocking asynchronous I/O in Node.js?', options: ['Event Loop', 'Multi-threading', 'Process Pool', 'Forking'], correctAnswer: 'Event Loop' },
    { question: 'What function exports code from a CommonJS module in Node.js?', options: ['module.exports', 'export default', 'return module', 'export.all'], correctAnswer: 'module.exports' },
    { question: 'Which middleware parses incoming JSON request bodies in Express?', options: ['express.json()', 'express.url()', 'body.parse()', 'json.middleware()'], correctAnswer: 'express.json()' },
    { question: 'What tool automatically restarts Node.js applications upon code changes?', options: ['Nodemon', 'PM2', 'Babel', 'Webpack'], correctAnswer: 'Nodemon' },
    { question: 'Which module handles file path concatenation in Node.js?', options: ['path', 'fs', 'url', 'os'], correctAnswer: 'path' },
    { question: 'What status code represents successful HTTP requests in Node.js API?', options: ['200', '404', '500', '302'], correctAnswer: '200' },
    { question: 'What status code represents Unauthorized access in Node.js APIs?', options: ['401', '403', '404', '500'], correctAnswer: '401' },
    { question: 'Which core module emits and listens for custom events in Node.js?', options: ['events', 'http', 'stream', 'net'], correctAnswer: 'events' },
    { question: 'What is the purpose of CORS middleware in Node.js APIs?', options: ['Allow cross-origin HTTP requests from frontend apps', 'Encrypt passwords', 'Compress HTTP payloads', 'Serve static HTML'], correctAnswer: 'Allow cross-origin HTTP requests from frontend apps' },
    { question: 'Which library generates and verifies JSON Web Tokens in Node.js?', options: ['jsonwebtoken', 'bcryptjs', 'dotenv', 'cors'], correctAnswer: 'jsonwebtoken' },
    { question: 'Which library hashes user passwords securely in Node.js?', options: ['bcryptjs', 'crypto-js', 'md5', 'sha256'], correctAnswer: 'bcryptjs' }
  ],

  'MongoDB': [
    { question: 'What type of database is MongoDB?', options: ['NoSQL Document Database', 'Relational SQL Database', 'Graph Database', 'Key-Value Memory Store'], correctAnswer: 'NoSQL Document Database' },
    { question: 'What format does MongoDB use to store data internally?', options: ['BSON', 'JSON', 'XML', 'CSV'], correctAnswer: 'BSON' },
    { question: 'What is a collection of records called in MongoDB?', options: ['Collection', 'Table', 'Sheet', 'Database'], correctAnswer: 'Collection' },
    { question: 'What represents an individual record inside a MongoDB collection?', options: ['Document', 'Row', 'Tuple', 'Field'], correctAnswer: 'Document' },
    { question: 'What ODM library models MongoDB schemas for Node.js?', options: ['Mongoose', 'Sequelize', 'Prisma', 'TypeORM'], correctAnswer: 'Mongoose' },
    { question: 'What primary key field is automatically generated for every document in MongoDB?', options: ['_id', 'id', 'uuid', 'pk'], correctAnswer: '_id' },
    { question: 'Which MongoDB command inserts a single document into a collection?', options: ['insertOne()', 'add()', 'create()', 'put()'], correctAnswer: 'insertOne()' },
    { question: 'Which command retrieves documents matching a query in MongoDB?', options: ['find()', 'select()', 'get()', 'query()'], correctAnswer: 'find()' },
    { question: 'Which MongoDB operator matches values greater than a specified value?', options: ['$gt', '$gte', '$max', '$higher'], correctAnswer: '$gt' },
    { question: 'Which operator updates specific fields inside a MongoDB document?', options: ['$set', '$update', '$change', '$modify'], correctAnswer: '$set' },
    { question: 'Which MongoDB command removes documents matching a filter?', options: ['deleteMany()', 'removeRow()', 'drop()', 'clean()'], correctAnswer: 'deleteMany()' },
    { question: 'What feature speeds up database query performance in MongoDB?', options: ['Indexes', 'Shards', 'Schemas', 'Views'], correctAnswer: 'Indexes' },
    { question: 'Which Mongoose method fetches a single document by its ObjectId?', options: ['findById()', 'getOne()', 'searchId()', 'fetchById()'], correctAnswer: 'findById()' },
    { question: 'What operation joins related documents across collections in MongoDB?', options: ['Aggregation $lookup', 'SQL INNER JOIN', 'Mongoose Pop', 'Cross-Join'], correctAnswer: 'Aggregation $lookup' },
    { question: 'Which method populates referenced document fields in Mongoose?', options: ['populate()', 'join()', 'include()', 'embed()'], correctAnswer: 'populate()' },
    { question: 'Which command counts documents matching a query filter in MongoDB?', options: ['countDocuments()', 'total()', 'length()', 'size()'], correctAnswer: 'countDocuments()' },
    { question: 'What cloud service hosts managed MongoDB databases?', options: ['MongoDB Atlas', 'AWS S3', 'Firebase', 'Heroku'], correctAnswer: 'MongoDB Atlas' },
    { question: 'What stage sorts pipeline data in MongoDB aggregation?', options: ['$sort', '$order', '$group', '$filter'], correctAnswer: '$sort' },
    { question: 'What stage limits the number of pipeline output documents in MongoDB aggregation?', options: ['$limit', '$top', '$max', '$take'], correctAnswer: '$limit' },
    { question: 'Which operator checks if a field exists in a MongoDB document?', options: ['$exists', '$has', '$in', '$contains'], correctAnswer: '$exists' }
  ],

  'HTML & CSS': [
    { question: 'Which HTML5 semantic element defines introductory content or navigation links?', options: ['<header>', '<top>', '<banner>', '<head>'], correctAnswer: '<header>' },
    { question: 'Which CSS property changes font color of text?', options: ['color', 'font-color', 'text-color', 'style-color'], correctAnswer: 'color' },
    { question: 'Which CSS property sets layout model to flexbox?', options: ['display: flex', 'layout: flex', 'flex: true', 'box: flex'], correctAnswer: 'display: flex' },
    { question: 'Which HTML attribute specifies an image alternative text description?', options: ['alt', 'title', 'desc', 'src'], correctAnswer: 'alt' },
    { question: 'Which CSS selector selects elements with a specific class name?', options: ['.classname', '#classname', 'classname', '*classname'], correctAnswer: '.classname' },
    { question: 'Which CSS selector selects elements with a specific ID?', options: ['#id', '.id', '*id', 'id()'], correctAnswer: '#id' },
    { question: 'Which HTML tag creates a hyperlink to another webpage?', options: ['<a>', '<link>', '<href>', '<url>'], correctAnswer: '<a>' },
    { question: 'Which CSS box-model property adds space inside an element border?', options: ['padding', 'margin', 'border', 'spacing'], correctAnswer: 'padding' },
    { question: 'Which CSS box-model property adds space outside an element border?', options: ['margin', 'padding', 'outline', 'gap'], correctAnswer: 'margin' },
    { question: 'Which HTML element embeds an external CSS stylesheet file?', options: ['<link rel="stylesheet">', '<style src="...">', '<script href="...">', '<css>'], correctAnswer: '<link rel="stylesheet">' },
    { question: 'Which CSS grid property defines column tracks?', options: ['grid-template-columns', 'grid-columns', 'grid-layout-col', 'flex-columns'], correctAnswer: 'grid-template-columns' },
    { question: 'Which CSS property centers flex items along the main axis?', options: ['justify-content', 'align-items', 'text-align', 'content-center'], correctAnswer: 'justify-content' },
    { question: 'Which CSS property centers flex items along the cross axis?', options: ['align-items', 'justify-content', 'vertical-align', 'center-cross'], correctAnswer: 'align-items' },
    { question: 'What HTML5 tag renders an unordered bulleted list?', options: ['<ul>', '<ol>', '<li>', '<list>'], correctAnswer: '<ul>' },
    { question: 'What HTML5 tag defines an individual item in a list?', options: ['<li>', '<item>', '<ul-item>', '<point>'], correctAnswer: '<li>' },
    { question: 'Which CSS unit is relative to the root font-size?', options: ['rem', 'em', 'px', 'pt'], correctAnswer: 'rem' },
    { question: 'Which CSS property creates rounded corners on borders?', options: ['border-radius', 'corner-radius', 'border-style', 'box-shadow'], correctAnswer: 'border-radius' },
    { question: 'Which HTML attribute opens a link in a new browser tab?', options: ['target="_blank"', 'open="new"', 'window="blank"', 'rel="newTab"'], correctAnswer: 'target="_blank"' },
    { question: 'Which CSS rule adapts web layouts based on screen width breakpoints?', options: ['@media queries', '@breakpoint', '@responsive', '@screen'], correctAnswer: '@media queries' },
    { question: 'Which CSS property controls element stacking order along Z-axis?', options: ['z-index', 'stack-order', 'layer', 'depth'], correctAnswer: 'z-index' }
  ],

  'SQL & Databases': [
    { question: 'Which SQL command selects data from a database table?', options: ['SELECT', 'GET', 'FETCH', 'READ'], correctAnswer: 'SELECT' },
    { question: 'Which SQL clause filters records based on specified conditions?', options: ['WHERE', 'HAVING', 'FILTER', 'MATCH'], correctAnswer: 'WHERE' },
    { question: 'Which SQL command inserts new rows into a database table?', options: ['INSERT INTO', 'ADD ROW', 'CREATE DATA', 'PUT'], correctAnswer: 'INSERT INTO' },
    { question: 'Which SQL command updates existing table records?', options: ['UPDATE', 'MODIFY', 'CHANGE', 'ALTER'], correctAnswer: 'UPDATE' },
    { question: 'Which SQL command removes matching rows from a table?', options: ['DELETE FROM', 'REMOVE', 'DROP ROW', 'CLEAR'], correctAnswer: 'DELETE FROM' },
    { question: 'What SQL column constraint uniquely identifies each table row?', options: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE INDEX', 'DEFAULT'], correctAnswer: 'PRIMARY KEY' },
    { question: 'What constraint establishes relationships between two database tables?', options: ['FOREIGN KEY', 'PRIMARY KEY', 'CHECK', 'INDEX'], correctAnswer: 'FOREIGN KEY' },
    { question: 'Which JOIN returns matching records from both related tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], correctAnswer: 'INNER JOIN' },
    { question: 'Which JOIN returns all rows from left table and matched rows from right table?', options: ['LEFT JOIN', 'INNER JOIN', 'FULL JOIN', 'RIGHT JOIN'], correctAnswer: 'LEFT JOIN' },
    { question: 'Which SQL command creates a new database table?', options: ['CREATE TABLE', 'MAKE TABLE', 'NEW TABLE', 'BUILD TABLE'], correctAnswer: 'CREATE TABLE' },
    { question: 'Which SQL function counts rows matching a query condition?', options: ['COUNT()', 'SUM()', 'TOTAL()', 'ROWS()'], correctAnswer: 'COUNT()' },
    { question: 'Which SQL clause groups rows sharing identical column values?', options: ['GROUP BY', 'ORDER BY', 'CLUSTER BY', 'PARTITION BY'], correctAnswer: 'GROUP BY' },
    { question: 'Which SQL clause filters aggregated query results?', options: ['HAVING', 'WHERE', 'FILTER', 'GROUP FILTER'], correctAnswer: 'HAVING' },
    { question: 'Which SQL clause sorts query results ascending or descending?', options: ['ORDER BY', 'SORT BY', 'ARRANGE BY', 'GROUP BY'], correctAnswer: 'ORDER BY' },
    { question: 'Which SQL keyword sorts results in descending order?', options: ['DESC', 'ASC', 'DOWN', 'REVERSE'], correctAnswer: 'DESC' },
    { question: 'Which command permanently saves transaction changes in SQL databases?', options: ['COMMIT', 'ROLLBACK', 'SAVEPOINT', 'STORE'], correctAnswer: 'COMMIT' },
    { question: 'Which command cancels uncommitted transaction changes in SQL?', options: ['ROLLBACK', 'COMMIT', 'UNDO', 'CANCEL'], correctAnswer: 'ROLLBACK' },
    { question: 'What does ACID stand for in relational database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Auto, Commit, Integrity, Disk', 'Async, Concurrent, Isolated, Durable'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability' },
    { question: 'Which SQL operator searches for specified string patterns using wildcard %?', options: ['LIKE', 'MATCHES', 'CONTAINS', 'SEARCH'], correctAnswer: 'LIKE' },
    { question: 'Which command completely removes a table and its structure from a database?', options: ['DROP TABLE', 'TRUNCATE TABLE', 'DELETE TABLE', 'REMOVE TABLE'], correctAnswer: 'DROP TABLE' }
  ]
};


async function seedAllSkillQuestionBanks() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('--- SEEDING QUESTION BANKS FOR ALL EXISTING SKILLS ---');

  const skillsInDb = await Skill.find();
  console.log(`Found ${skillsInDb.length} skills in master catalog.`);

  let totalAdded = 0;
  let totalSkipped = 0;

  for (const skillItem of skillsInDb) {
    const name = skillItem.name;
    const questionsToSeed = comprehensiveQuestions[name] || [];

    if (questionsToSeed.length === 0) {
      console.log(`- ${name}: No pre-configured question array. Skipping auto-seed.`);
      continue;
    }

    let addedForSkill = 0;
    let skippedForSkill = 0;

    for (const q of questionsToSeed) {
      const existing = await SkillQuestion.findOne({ skill: skillItem._id, question: q.question });
      if (!existing) {
        await SkillQuestion.create({
          skill: skillItem._id,
          skillName: skillItem.name,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || `Standard ${skillItem.name} fundamental question.`,
          difficulty: 'Basic',
          isActive: true
        });
        addedForSkill++;
        totalAdded++;
      } else {
        skippedForSkill++;
        totalSkipped++;
      }
    }

    const count = await SkillQuestion.countDocuments({ skill: skillItem._id, isActive: true });
    console.log(`✔ ${name}: ${count} active questions (Added: ${addedForSkill}, Skipped: ${skippedForSkill})`);
  }

  console.log(`\n--- SEEDING COMPLETED ---`);
  console.log(`Total new questions added: ${totalAdded}`);
  console.log(`Total duplicate questions skipped: ${totalSkipped}`);

  process.exit(0);
}

seedAllSkillQuestionBanks().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
