const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');

const expandedSkillsCatalog = [
  // --- FRONTEND & WEB ---
  { name: 'TypeScript', category: 'Development', description: 'Typed superset of JavaScript, static types, interfaces, and generics.' },
  { name: 'Angular', category: 'Development', description: 'TypeScript-based web application framework by Google.' },
  { name: 'Vue.js', category: 'Development', description: 'Progressive JavaScript framework for building user interfaces.' },
  { name: 'Next.js', category: 'Development', description: 'React framework for server-side rendering, static site generation, and fullstack apps.' },
  { name: 'Tailwind CSS', category: 'Development', description: 'Utility-first CSS framework for rapid UI styling.' },

  // --- BACKEND & PROGRAMMING ---
  { name: 'C# & .NET', category: 'Development', description: 'C# programming language, .NET Core, ASP.NET Web APIs, and object-oriented design.' },
  { name: 'PHP', category: 'Development', description: 'Server-side scripting language for web application development.' },
  { name: 'Express.js', category: 'Development', description: 'Fast, unopinionated, minimalist web framework for Node.js.' },
  { name: 'Django', category: 'Development', description: 'High-level Python web framework that encourages rapid development.' },
  { name: 'Go (Golang)', category: 'Development', description: 'Statically typed, compiled programming language designed by Google for concurrency.' },
  { name: 'Rust', category: 'Development', description: 'Systems programming language focused on safety, speed, and concurrency.' },
  { name: 'Ruby on Rails', category: 'Development', description: 'Server-side web application framework written in Ruby.' },

  // --- DATABASES & CLOUD ---
  { name: 'MySQL', category: 'Development', description: 'Relational database management system based on SQL.' },
  { name: 'PostgreSQL', category: 'Development', description: 'Advanced open-source relational database supporting JSON and complex queries.' },
  { name: 'Redis', category: 'Development', description: 'In-memory data structure store used as a database, cache, and message broker.' },
  { name: 'Git & GitHub', category: 'Development', description: 'Distributed version control system, branching, pull requests, and repository management.' },
  { name: 'Docker & DevOps', category: 'Development', description: 'Containerization, Docker images, CI/CD pipelines, and cloud deployment basics.' },

  // --- MOBILE & CLOUD / OTHER DOMAINS ---
  { name: 'Flutter & Dart', category: 'Development', description: 'Cross-platform mobile and web application framework by Google.' },
  { name: 'Machine Learning Basics', category: 'Data & AI', description: 'Supervised/unsupervised learning algorithms, Scikit-Learn, and model evaluation.' }
];

const comprehensiveNewQuestions = {
  'TypeScript': [
    { question: 'What is TypeScript?', options: ['Typed superset of JavaScript that compiles to plain JS', 'Replacement for HTML', 'Database query language', 'CSS preprocessor'], correctAnswer: 'Typed superset of JavaScript that compiles to plain JS' },
    { question: 'Which keyword defines custom object type structures in TypeScript?', options: ['interface', 'struct', 'schema', 'typegroup'], correctAnswer: 'interface' },
    { question: 'Which command compiles TypeScript code to JavaScript?', options: ['tsc', 'ts-compile', 'node-ts', 'typescript'], correctAnswer: 'tsc' },
    { question: 'Which config file specifies TypeScript compiler options?', options: ['tsconfig.json', 'package.json', 'ts.config.js', 'typed.json'], correctAnswer: 'tsconfig.json' },
    { question: 'What type represents values that could be of any data type in TS?', options: ['any', 'unknown', 'void', 'never'], correctAnswer: 'any' },
    { question: 'Which type explicitly indicates a function does not return a value in TS?', options: ['void', 'null', 'never', 'undefined'], correctAnswer: 'void' },
    { question: 'How do you specify an array of strings in TypeScript syntax?', options: ['string[]', 'Array<string>', 'Both string[] and Array<string>', 'string{}'], correctAnswer: 'Both string[] and Array<string>' },
    { question: 'Which syntax creates optional properties inside TypeScript interfaces?', options: ['property?: type', 'property!: type', 'optional property: type', 'property*: type'], correctAnswer: 'property?: type' },
    { question: 'Which keyword creates a union type allowing multiple allowed types in TS?', options: ['|', '&', 'or', 'union'], correctAnswer: '|' },
    { question: 'Which keyword creates an intersection type combining multiple TS types?', options: ['&', '|', 'and', 'combine'], correctAnswer: '&' },
    { question: 'What symbol enforces non-null assertion in TypeScript?', options: ['!', '?', ':', '#'], correctAnswer: '!' },
    { question: 'What TypeScript feature provides a way to define set of named constants?', options: ['enum', 'list', 'constArray', 'constantGroup'], correctAnswer: 'enum' },
    { question: 'Which type safe alternative to any forces type checking before usage in TS?', options: ['unknown', 'any', 'void', 'never'], correctAnswer: 'unknown' },
    { question: 'Which operator casts a variable to a specific type in TS?', options: ['as', 'cast', 'to', 'convert'], correctAnswer: 'as' },
    { question: 'Which modifier prevents property mutation after initialization in TS?', options: ['readonly', 'const', 'immutable', 'static'], correctAnswer: 'readonly' },
    { question: 'How do you declare generic function parameters in TypeScript?', options: ['<T>', '[T]', '{T}', '(T)'], correctAnswer: '<T>' },
    { question: 'Which TS feature allows inspecting type inside conditional blocks at runtime?', options: ['Type Guards', 'Type Casting', 'Interfaces', 'Decorators'], correctAnswer: 'Type Guards' },
    { question: 'What TS feature decorates class declarations or members with meta-programming annotations?', options: ['Decorators', 'Generics', 'Enums', 'Tuples'], correctAnswer: 'Decorators' },
    { question: 'What TS utility type makes all properties of an interface optional?', options: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Pick<T>'], correctAnswer: 'Partial<T>' },
    { question: 'What TS utility type selects specified keys from an existing interface?', options: ['Pick<T, K>', 'Omit<T, K>', 'Extract<T, U>', 'Exclude<T, U>'], correctAnswer: 'Pick<T, K>' }
  ],

  'Angular': [
    { question: 'What language is primarily used to build Angular applications?', options: ['TypeScript', 'Python', 'Java', 'PHP'], correctAnswer: 'TypeScript' },
    { question: 'Which CLI tool generates components, services, and modules in Angular?', options: ['ng', 'angular-cli', 'npm', 'vite'], correctAnswer: 'ng' },
    { question: 'Which decorator marks a TypeScript class as an Angular component?', options: ['@Component', '@Injectable', '@Directive', '@NgModule'], correctAnswer: '@Component' },
    { question: 'Which decorator marks an Angular service as available for Dependency Injection?', options: ['@Injectable', '@Component', '@Pipe', '@Service'], correctAnswer: '@Injectable' },
    { question: 'Which built-in directive conditionally includes or excludes HTML elements in Angular?', options: ['*ngIf', '*ngFor', '*ngSwitch', 'ngClass'], correctAnswer: '*ngIf' },
    { question: 'Which directive loops over an array to render template items in Angular?', options: ['*ngFor', '*ngRepeat', '*ngLoop', 'ngEach'], correctAnswer: '*ngFor' },
    { question: 'What syntax performs string interpolation in Angular HTML templates?', options: ['{{ value }}', '{ value }', '${ value }', '<%= value %>'], correctAnswer: '{{ value }}' },
    { question: 'What syntax binds a component property to an HTML element property in Angular?', options: ['[property]="value"', '(property)="value"', 'bind-property="value"', '{{ property }}'], correctAnswer: '[property]="value"' },
    { question: 'What syntax binds an HTML DOM event to an Angular component handler method?', options: ['(event)="handler()"', '[event]="handler()"', 'on-event="handler()"', '{{ handler() }}'], correctAnswer: '(event)="handler()"' },
    { question: 'What syntax enables two-way data binding in Angular forms?', options: ['[(ngModel)]="value"', '[ngModel]="value"', '(ngModel)="value"', 'bindTwoWay="value"'], correctAnswer: '[(ngModel)]="value"' },

    { question: 'Which Angular module provides reactive form directives like FormBuilder?', options: ['ReactiveFormsModule', 'FormsModule', 'BrowserModule', 'HttpClientModule'], correctAnswer: 'ReactiveFormsModule' },
    { question: 'Which lifecycle hook executes after Angular initializes input properties?', options: ['ngOnInit', 'ngOnChanges', 'ngAfterViewInit', 'ngOnDestroy'], correctAnswer: 'ngOnInit' },
    { question: 'Which service executes HTTP requests in Angular apps?', options: ['HttpClient', 'HttpService', 'FetchClient', 'AxiosAngular'], correctAnswer: 'HttpClient' },
    { question: 'What Angular feature transforms raw template output data (e.g. date formatting)?', options: ['Pipes', 'Directives', 'Services', 'Resolvers'], correctAnswer: 'Pipes' },
    { question: 'What design pattern manages component data sharing automatically in Angular?', options: ['Dependency Injection', 'Singleton Pattern', 'MVC Pattern', 'Observer Pattern'], correctAnswer: 'Dependency Injection' },
    { question: 'Which directive dynamically toggles CSS classes based on expression in Angular?', options: ['ngClass', 'ngStyle', 'ngToggle', 'ngClassList'], correctAnswer: 'ngClass' },
    { question: 'What Angular feature intercepts router navigation to check user authentication permissions?', options: ['Route Guards', 'Interceptors', 'Pipes', 'Directives'], correctAnswer: 'Route Guards' },
    { question: 'Which RxJS class represents data streams consumed across Angular services?', options: ['Observable', 'Promise', 'EventSubject', 'StreamObject'], correctAnswer: 'Observable' },
    { question: 'Which RxJS subject allows multi-casting state values with an initial value in Angular?', options: ['BehaviorSubject', 'Subject', 'ReplaySubject', 'AsyncSubject'], correctAnswer: 'BehaviorSubject' },
    { question: 'Which lifecycle hook cleans up subscriptions when an Angular component is destroyed?', options: ['ngOnDestroy', 'ngOnInit', 'ngOnChanges', 'ngDocheck'], correctAnswer: 'ngOnDestroy' }
  ],

  'Vue.js': [
    { question: 'What core feature provides reactive state in Vue 3 Composition API?', options: ['ref() and reactive()', 'useState()', 'data()', 'state()'], correctAnswer: 'ref() and reactive()' },
    { question: 'What extension defines Single File Components in Vue?', options: ['.vue', '.vjs', '.component', '.template'], correctAnswer: '.vue' },
    { question: 'Which directive renders text content dynamically in Vue template markup?', options: ['{{ text }}', 'v-text', 'v-html', 'Both {{ text }} and v-text'], correctAnswer: 'Both {{ text }} and v-text' },
    { question: 'Which directive conditionally renders an element in Vue.js DOM?', options: ['v-if', 'v-show', 'v-for', 'v-model'], correctAnswer: 'v-if' },
    { question: 'Which directive toggles element CSS display property without removing from DOM in Vue?', options: ['v-show', 'v-if', 'v-visible', 'v-display'], correctAnswer: 'v-show' },
    { question: 'Which directive loops through an array to render dynamic elements in Vue?', options: ['v-for', 'v-loop', 'v-each', 'v-repeat'], correctAnswer: 'v-for' },
    { question: 'Which directive enables two-way data binding on form inputs in Vue.js?', options: ['v-model', 'v-bind', 'v-on', 'v-sync'], correctAnswer: 'v-model' },
    { question: 'Which directive binds dynamic attributes to HTML elements in Vue.js (shorthand :)?', options: ['v-bind', 'v-on', 'v-slot', 'v-attr'], correctAnswer: 'v-bind' },
    { question: 'Which directive attaches event listeners in Vue.js (shorthand @)?', options: ['v-on', 'v-bind', 'v-listen', 'v-event'], correctAnswer: 'v-on' },
    { question: 'What property creates cached derived state calculations in Vue?', options: ['computed()', 'watch()', 'methods', 'props'], correctAnswer: 'computed()' },
    { question: 'What function observes reactive property changes and runs side effects in Vue?', options: ['watch()', 'computed()', 'effect()', 'observe()'], correctAnswer: 'watch()' },
    { question: 'Which lifecycle hook runs after a Vue component instance is mounted to DOM?', options: ['onMounted', 'onCreated', 'onUpdated', 'onBeforeMount'], correctAnswer: 'onMounted' },
    { question: 'What syntax passes data from parent to child component in Vue?', options: ['Props', 'Events', 'Slots', 'Provide/Inject'], correctAnswer: 'Props' },
    { question: 'How does a child component send events upward to a parent component in Vue?', options: ['emit()', 'dispatch()', 'send()', 'props'], correctAnswer: 'emit()' },
    { question: 'What official state management library is recommended for Vue 3 apps?', options: ['Pinia', 'Vuex', 'Redux', 'MobX'], correctAnswer: 'Pinia' },
    { question: 'What feature provides template content insertion placeholders in Vue components?', options: ['Slots', 'Props', 'Teleport', 'Suspense'], correctAnswer: 'Slots' },
    { question: 'What built-in Vue component renders DOM nodes outside current component hierarchy?', options: ['<Teleport>', '<Suspense>', '<KeepAlive>', '<Transition>'], correctAnswer: '<Teleport>' },
    { question: 'What built-in Vue component caches inactive component instances in memory?', options: ['<KeepAlive>', '<Cache>', '<Teleport>', '<Transition>'], correctAnswer: '<KeepAlive>' },
    { question: 'What official routing library powers navigation in Vue applications?', options: ['Vue Router', 'React Router', 'Express Router', 'Page.js'], correctAnswer: 'Vue Router' },
    { question: 'What script tag option enables clean Composition API syntax in Vue 3 SFCs?', options: ['<script setup>', '<script composition>', '<script api>', '<script vue3>'], correctAnswer: '<script setup>' }
  ],

  'MySQL': [
    { question: 'What language is used to query MySQL databases?', options: ['SQL', 'CQL', 'NoSQL', 'T-SQL'], correctAnswer: 'SQL' },
    { question: 'Which command displays all databases hosted on a MySQL server?', options: ['SHOW DATABASES;', 'LIST DATABASES;', 'GET DATABASES;', 'SELECT DATABASES;'], correctAnswer: 'SHOW DATABASES;' },
    { question: 'Which command selects active working database in MySQL session?', options: ['USE databasename;', 'SELECT databasename;', 'OPEN databasename;', 'CONNECT databasename;'], correctAnswer: 'USE databasename;' },
    { question: 'Which storage engine is default for transactional tables in modern MySQL?', options: ['InnoDB', 'MyISAM', 'MEMORY', 'CSV'], correctAnswer: 'InnoDB' },
    { question: 'Which command inserts new records into a MySQL table?', options: ['INSERT INTO', 'ADD ROW', 'PUT', 'NEW RECORD'], correctAnswer: 'INSERT INTO' },
    { question: 'Which clause filters rows matching specific conditions in MySQL query?', options: ['WHERE', 'HAVING', 'FILTER', 'MATCH'], correctAnswer: 'WHERE' },
    { question: 'Which clause limits the maximum number of returned rows in MySQL?', options: ['LIMIT', 'TOP', 'FETCH FIRST', 'ROWCOUNT'], correctAnswer: 'LIMIT' },
    { question: 'Which function auto-increments unique integer primary key IDs in MySQL?', options: ['AUTO_INCREMENT', 'SERIAL', 'IDENTITY', 'NEXTVAL'], correctAnswer: 'AUTO_INCREMENT' },
    { question: 'Which JOIN retrieves matching rows from both tables in MySQL?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], correctAnswer: 'INNER JOIN' },
    { question: 'Which JOIN returns all rows from left table and matching rows from right in MySQL?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correctAnswer: 'LEFT JOIN' },
    { question: 'Which function returns total number of non-null rows in MySQL table?', options: ['COUNT()', 'SUM()', 'TOTAL()', 'LENGTH()'], correctAnswer: 'COUNT()' },
    { question: 'Which clause groups records sharing common column values in MySQL?', options: ['GROUP BY', 'ORDER BY', 'PARTITION BY', 'ALIGN BY'], correctAnswer: 'GROUP BY' },
    { question: 'Which clause filters grouped aggregation results in MySQL?', options: ['HAVING', 'WHERE', 'FILTER', 'GROUP FILTER'], correctAnswer: 'HAVING' },
    { question: 'Which command modifies existing table structure column definitions in MySQL?', options: ['ALTER TABLE', 'UPDATE TABLE', 'MODIFY TABLE', 'CHANGE TABLE'], correctAnswer: 'ALTER TABLE' },
    { question: 'Which command empties all records from a table without deleting structure in MySQL?', options: ['TRUNCATE TABLE', 'DROP TABLE', 'DELETE ALL', 'CLEAR TABLE'], correctAnswer: 'TRUNCATE TABLE' },
    { question: 'Which command completely deletes a table and its definition from MySQL database?', options: ['DROP TABLE', 'TRUNCATE TABLE', 'REMOVE TABLE', 'DELETE TABLE'], correctAnswer: 'DROP TABLE' },
    { question: 'What feature indexes table columns to accelerate search performance in MySQL?', options: ['INDEX', 'KEY', 'TRIGGER', 'VIEW'], correctAnswer: 'INDEX' },
    { question: 'Which SQL function concatenates multiple string column values in MySQL?', options: ['CONCAT()', 'STRING_ADD()', 'MERGE()', 'APPEND()'], correctAnswer: 'CONCAT()' },
    { question: 'Which operator checks if a column value matches a list of specified values in MySQL?', options: ['IN', 'EXISTS', 'LIKE', 'BETWEEN'], correctAnswer: 'IN' },
    { question: 'Which operator searches for column values within an inclusive range in MySQL?', options: ['BETWEEN', 'IN', 'WITHIN', 'RANGE'], correctAnswer: 'BETWEEN' }
  ],

  'PostgreSQL': [
    { question: 'What type of database system is PostgreSQL?', options: ['Open-Source Object-Relational Database (ORDBMS)', 'Document NoSQL Database', 'Key-Value Memory Cache', 'Graph Database'], correctAnswer: 'Open-Source Object-Relational Database (ORDBMS)' },
    { question: 'Which data type stores native JSON document structures in PostgreSQL?', options: ['JSONB', 'BSON', 'VARCHAR', 'TEXT'], correctAnswer: 'JSONB' },
    { question: 'Which command auto-creates auto-incrementing integer sequences in older PostgreSQL schemas?', options: ['SERIAL', 'AUTO_INCREMENT', 'IDENTITY', 'SEQUENCE'], correctAnswer: 'SERIAL' },
    { question: 'Which command retrieves rows from a PostgreSQL table?', options: ['SELECT', 'GET', 'FETCH', 'READ'], correctAnswer: 'SELECT' },
    { question: 'Which CLI tool is official terminal interactive client for PostgreSQL?', options: ['psql', 'mysql', 'pgadmin-cli', 'postgres-shell'], correctAnswer: 'psql' },
    { question: 'Which clause limits maximum returned query rows in PostgreSQL?', options: ['LIMIT', 'TOP', 'MAXROWS', 'FETCH ONLY'], correctAnswer: 'LIMIT' },
    { question: 'Which clause skips specified number of initial query rows in PostgreSQL?', options: ['OFFSET', 'SKIP', 'LEAP', 'START'], correctAnswer: 'OFFSET' },
    { question: 'Which operator performs case-insensitive regex pattern matching in PostgreSQL?', options: ['ILIKE', 'LIKE', 'MATCH', 'REGEX'], correctAnswer: 'ILIKE' },
    { question: 'Which feature creates virtual saved queries in PostgreSQL?', options: ['VIEW', 'INDEX', 'TRIGGER', 'FUNCTION'], correctAnswer: 'VIEW' },
    { question: 'Which feature executes automated custom procedural functions before/after table modifications in Postgres?', options: ['Triggers', 'Indexes', 'Foreign Keys', 'Views'], correctAnswer: 'Triggers' },
    { question: 'What procedural language allows writing server-side stored functions in Postgres?', options: ['PL/pgSQL', 'T-SQL', 'PL/SQL', 'pgScript'], correctAnswer: 'PL/pgSQL' },
    { question: 'Which extension provides spatial & geographic GIS data query features in Postgres?', options: ['PostGIS', 'pgCrypto', 'pgVector', 'pgSpatial'], correctAnswer: 'PostGIS' },
    { question: 'Which extension provides vector embedding similarity search features for AI applications in Postgres?', options: ['pgvector', 'PostGIS', 'pg_trgm', 'uuid-ossp'], correctAnswer: 'pgvector' },
    { question: 'Which command generates unique 128-bit UUID primary keys in PostgreSQL?', options: ['gen_random_uuid()', 'uuid_generate()', 'new_guid()', 'make_uuid()'], correctAnswer: 'gen_random_uuid()' },
    { question: 'Which clause handles upsert conflicts gracefully in PostgreSQL INSERT statements?', options: ['ON CONFLICT DO UPDATE', 'ON DUPLICATE KEY UPDATE', 'IF EXISTS UPDATE', 'UPSERT INTO'], correctAnswer: 'ON CONFLICT DO UPDATE' },
    { question: 'Which command exports database backup dumps in PostgreSQL?', options: ['pg_dump', 'pg_backup', 'postgres_export', 'psql_dump'], correctAnswer: 'pg_dump' },
    { question: 'Which indexing algorithm is default for B-tree index lookups in Postgres?', options: ['B-Tree', 'GIN', 'GiST', 'BRIN'], correctAnswer: 'B-Tree' },
    { question: 'Which specialized index type optimizes full-text search and JSONB containment in Postgres?', options: ['GIN (Generalized Inverted Index)', 'B-Tree', 'Hash', 'BRIN'], correctAnswer: 'GIN (Generalized Inverted Index)' },
    { question: 'Which window function assigns sequential integer rank to rows inside partition in Postgres?', options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'COUNT()'], correctAnswer: 'ROW_NUMBER()' },
    { question: 'Which SQL clause returns modified/inserted rows immediately without issuing extra SELECT in Postgres?', options: ['RETURNING', 'OUTPUT', 'FETCH', 'RESULT'], correctAnswer: 'RETURNING' }
  ],

  'PHP': [
    { question: 'What does PHP stand for originally?', options: ['Personal Home Page (now Hypertext Preprocessor)', 'Private Hosting Program', 'Public Hypertext Protocol', 'Pre-Processed HTML'], correctAnswer: 'Personal Home Page (now Hypertext Preprocessor)' },
    { question: 'Which character precedes all variable names in PHP?', options: ['$', '@', '#', '&'], correctAnswer: '$' },
    { question: 'Which function outputs text string to web page response in PHP?', options: ['echo', 'print_r', 'var_dump', 'write'], correctAnswer: 'echo' },
    { question: 'Which symbol is used for string concatenation in PHP?', options: ['.', '+', '&', ','], correctAnswer: '.' },
    { question: 'Which superglobal array contains form data sent via HTTP POST in PHP?', options: ['$_POST', '$_GET', '$_REQUEST', '$_SERVER'], correctAnswer: '$_POST' },
    { question: 'Which superglobal array contains URL query parameters in PHP?', options: ['$_GET', '$_POST', '$_QUERY', '$_PARAMS'], correctAnswer: '$_GET' },
    { question: 'Which function detailed inspects variable data type and structure in PHP?', options: ['var_dump()', 'print_r()', 'echo()', 'inspect()'], correctAnswer: 'var_dump()' },
    { question: 'Which package dependency manager is standard for PHP projects?', options: ['Composer', 'npm', 'pip', 'gem'], correctAnswer: 'Composer' },
    { question: 'Which web framework is most popular in modern PHP ecosystem?', options: ['Laravel', 'Symfony', 'CodeIgniter', 'CakePHP'], correctAnswer: 'Laravel' },
    { question: 'Which operator checks strict equality (value and type) in PHP?', options: ['===', '==', '=', 'eq'], correctAnswer: '===' },
    { question: 'Which built-in extension provides secure prepared SQL statements for database access in PHP?', options: ['PDO (PHP Data Objects)', 'MySQLi', 'PHP-SQL', 'DBConnect'], correctAnswer: 'PDO (PHP Data Objects)' },
    { question: 'Which keyword handles exceptions in PHP try blocks?', options: ['catch', 'except', 'trap', 'handle'], correctAnswer: 'catch' },
    { question: 'Which superglobal array stores session state across page reloads in PHP?', options: ['$_SESSION', '$_COOKIE', '$_STATE', '$_USER'], correctAnswer: '$_SESSION' },
    { question: 'Which function starts or resumes an active PHP session?', options: ['session_start()', 'start_session()', 'session_init()', 'init_session()'], correctAnswer: 'session_start()' },
    { question: 'Which built-in function parses JSON string into PHP array or object?', options: ['json_decode()', 'json_encode()', 'json_parse()', 'parse_json()'], correctAnswer: 'json_decode()' },
    { question: 'Which function converts PHP array/object into JSON string?', options: ['json_encode()', 'json_decode()', 'to_json()', 'stringify()'], correctAnswer: 'json_encode()' },
    { question: 'Which keyword defines class methods in object-oriented PHP?', options: ['function', 'def', 'method', 'fn'], correctAnswer: 'function' },
    { question: 'Which keyword instantiates objects from class templates in PHP?', options: ['new', 'create', 'make', 'instance'], correctAnswer: 'new' },
    { question: 'Which special keyword refers to current class instance properties in PHP?', options: ['$this', 'self', 'this', 'me'], correctAnswer: '$this' },
    { question: 'Which special keyword refers to static class properties/methods in PHP?', options: ['self::', 'this->', 'static->', 'class::'], correctAnswer: 'self::' }
  ],

  'C# & .NET': [
    { question: 'What framework supports C# execution cross-platform?', options: ['.NET Core / .NET 6+', 'JVM', 'Node.js', 'V8'], correctAnswer: '.NET Core / .NET 6+' },
    { question: 'Which company originally created C# and .NET framework?', options: ['Microsoft', 'Sun Microsystems', 'Google', 'Apple'], correctAnswer: 'Microsoft' },
    { question: 'Which method serves as entry point for C# console applications?', options: ['static void Main()', 'public void Start()', 'void Init()', 'static void Execute()'], correctAnswer: 'static void Main()' },
    { question: 'Which keyword creates new object instances in C#?', options: ['new', 'create', 'alloc', 'make'], correctAnswer: 'new' },
    { question: 'Which ORM framework maps C# objects to relational database tables?', options: ['Entity Framework Core (EF Core)', 'Dapper', 'NHibernate', 'LINQ2DB'], correctAnswer: 'Entity Framework Core (EF Core)' },
    { question: 'Which C# language feature allows writing SQL-like queries directly over collections?', options: ['LINQ (Language Integrated Query)', 'Lambda', 'Async/Await', 'Generics'], correctAnswer: 'LINQ (Language Integrated Query)' },
    { question: 'Which keyword declares asynchronous methods in C#?', options: ['async', 'task', 'thread', 'parallel'], correctAnswer: 'async' },
    { question: 'Which keyword pauses async method execution until Task completes in C#?', options: ['await', 'wait', 'defer', 'hold'], correctAnswer: 'await' },
    { question: 'Which type represents asynchronous operations returning a value in C#?', options: ['Task<T>', 'Promise<T>', 'Future<T>', 'AsyncVal<T>'], correctAnswer: 'Task<T>' },
    { question: 'Which modifier prevents class inheritance in C#?', options: ['sealed', 'final', 'static', 'abstract'], correctAnswer: 'sealed' },
    { question: 'Which access specifier limits member accessibility to containing class in C#?', options: ['private', 'public', 'protected', 'internal'], correctAnswer: 'private' },
    { question: 'Which access specifier grants member access to derived classes in C#?', options: ['protected', 'private', 'internal', 'public'], correctAnswer: 'protected' },
    { question: 'Which web framework builds RESTful APIs in .NET?', options: ['ASP.NET Core Web API', 'SignalR', 'Blazor', 'WPF'], correctAnswer: 'ASP.NET Core Web API' },
    { question: 'Which C# feature creates immutable data objects with built-in value equality?', options: ['record', 'struct', 'class', 'interface'], correctAnswer: 'record' },
    { question: 'What symbol represents nullable reference types operator in C#?', options: ['?', '!', '*', '#'], correctAnswer: '?' },
    { question: 'Which keyword handles exceptions in C# try blocks?', options: ['catch', 'except', 'trap', 'handle'], correctAnswer: 'catch' },
    { question: 'Which keyword defines contract interfaces in C#?', options: ['interface', 'contract', 'abstract class', 'protocol'], correctAnswer: 'interface' },
    { question: 'Which dependency injection lifetime creates one instance per HTTP request in ASP.NET Core?', options: ['Scoped', 'Transient', 'Singleton', 'PerCall'], correctAnswer: 'Scoped' },
    { question: 'Which framework enables building fullstack interactive web UIs using C# instead of JS?', options: ['Blazor', 'Razor Pages', 'MAUI', 'Xamarin'], correctAnswer: 'Blazor' },
    { question: 'What package manager distributes .NET libraries and dependencies?', options: ['NuGet', 'npm', 'pip', 'Maven'], correctAnswer: 'NuGet' }
  ],

  'Git & GitHub': [
    { question: 'What type of tool is Git?', options: ['Distributed Version Control System', 'Database Management System', 'Web Framework', 'Cloud Server'], correctAnswer: 'Distributed Version Control System' },
    { question: 'Which command initializes a new Git repository in a directory?', options: ['git init', 'git create', 'git start', 'git setup'], correctAnswer: 'git init' },
    { question: 'Which command stages modified files for commit in Git?', options: ['git add .', 'git stage', 'git commit', 'git put'], correctAnswer: 'git add .' },
    { question: 'Which command records staged file snapshots into repository history?', options: ['git commit -m "message"', 'git save', 'git push', 'git store'], correctAnswer: 'git commit -m "message"' },
    { question: 'Which command displays working directory and staging area status in Git?', options: ['git status', 'git log', 'git info', 'git check'], correctAnswer: 'git status' },
    { question: 'Which command views commit history logs in Git?', options: ['git log', 'git history', 'git list', 'git commits'], correctAnswer: 'git log' },
    { question: 'Which command creates or switches branches in modern Git?', options: ['git checkout -b branch_name or git switch -c branch_name', 'git branch new', 'git make-branch', 'git fork'], correctAnswer: 'git checkout -b branch_name or git switch -c branch_name' },
    { question: 'Which command merges changes from another branch into current active branch?', options: ['git merge branch_name', 'git combine', 'git join', 'git pull-branch'], correctAnswer: 'git merge branch_name' },
    { question: 'Which command uploads local commits to remote repository (e.g. GitHub)?', options: ['git push origin main', 'git upload', 'git send', 'git sync'], correctAnswer: 'git push origin main' },
    { question: 'Which command fetches and merges remote repository changes into local branch?', options: ['git pull', 'git fetch', 'git clone', 'git download'], correctAnswer: 'git pull' },
    { question: 'Which command copies an existing remote repository to local machine?', options: ['git clone URL', 'git copy', 'git download', 'git get'], correctAnswer: 'git clone URL' },
    { question: 'What GitHub feature allows developers to propose changes and request code review before merging?', options: ['Pull Request (PR)', 'Issue Ticket', 'Fork Action', 'Commit Review'], correctAnswer: 'Pull Request (PR)' },
    { question: 'What file instructs Git to ignore specified files/directories (e.g. node_modules)?', options: ['.gitignore', '.gitkeep', '.ignore', 'gitconfig'], correctAnswer: '.gitignore' },
    { question: 'Which command temporarily stashes uncommitted changes in working directory?', options: ['git stash', 'git hide', 'git save-draft', 'git hold'], correctAnswer: 'git stash' },
    { question: 'Which command applies previously stashed changes back to working tree?', options: ['git stash pop', 'git stash apply', 'Both git stash pop and git stash apply', 'git stash restore'], correctAnswer: 'Both git stash pop and git stash apply' },
    { question: 'What git feature connects local repository to remote server URL?', options: ['git remote add origin URL', 'git connect URL', 'git link URL', 'git server URL'], correctAnswer: 'git remote add origin URL' },
    { question: 'Which command re-applies commits on top of another base tip branch cleanly?', options: ['git rebase', 'git merge', 'git reset', 'git cherry-pick'], correctAnswer: 'git rebase' },
    { question: 'Which command picks a specific commit from another branch and applies it to current branch?', options: ['git cherry-pick commit_hash', 'git copy-commit', 'git pick', 'git apply-hash'], correctAnswer: 'git cherry-pick commit_hash' },
    { question: 'What GitHub feature automates CI/CD build, test, and deployment workflows?', options: ['GitHub Actions', 'GitHub Pages', 'GitHub Gists', 'GitHub Copilot'], correctAnswer: 'GitHub Actions' },
    { question: 'Which Git command discards uncommitted local modifications in a file?', options: ['git restore filename', 'git discard filename', 'git delete filename', 'git undo filename'], correctAnswer: 'git restore filename' }
  ],

  'Next.js': [
    { question: 'What JavaScript library is Next.js built on top of?', options: ['React', 'Vue', 'Angular', 'Svelte'], correctAnswer: 'React' },
    { question: 'Which rendering strategy renders pages on every request at runtime in Next.js?', options: ['Server-Side Rendering (SSR)', 'Static Site Generation (SSG)', 'Client-Side Rendering (CSR)', 'Incremental Static Regeneration (ISR)'], correctAnswer: 'Server-Side Rendering (SSR)' },
    { question: 'Which directory structure manages routes in Next.js 13+ App Router?', options: ['app/', 'pages/', 'routes/', 'views/'], correctAnswer: 'app/' },
    { question: 'Which built-in component optimizes image loading and formatting in Next.js?', options: ['<Image />', '<img />', '<NextImage />', '<Pic />'], correctAnswer: '<Image />' },
    { question: 'Which directive designates a component as a Client Component in App Router?', options: ['"use client"', '"use browser"', '"client only"', '"CSR"'], correctAnswer: '"use client"' },
    { question: 'What feature updates static pages in background without full site rebuild in Next.js?', options: ['Incremental Static Regeneration (ISR)', 'SSR', 'Hot Reloading', 'Hydration'], correctAnswer: 'Incremental Static Regeneration (ISR)' },
    { question: 'Which special file defines custom layout wrappers across routes in App Router?', options: ['layout.jsx', 'page.jsx', 'template.jsx', 'root.jsx'], correctAnswer: 'layout.jsx' },
    { question: 'Which file renders route content in Next.js App Router?', options: ['page.jsx', 'index.jsx', 'view.jsx', 'route.jsx'], correctAnswer: 'page.jsx' },
    { question: 'Which component performs pre-fetched client navigation in Next.js?', options: ['<Link href="...">', '<a>', '<Navigate>', '<RouterLink>'], correctAnswer: '<Link href="...">' },
    { question: 'Which hook retrieves current route path parameters in Next.js client components?', options: ['usePathname()', 'useRouter()', 'useParams()', 'useRoute()'], correctAnswer: 'usePathname()' },
    { question: 'Which hook provides programmatic navigation in Next.js App Router?', options: ['useRouter() from next/navigation', 'useHistory()', 'useNavigate()', 'useRoute()'], correctAnswer: 'useRouter() from next/navigation' },
    { question: 'What feature provides automated server-side API endpoints in Next.js?', options: ['Route Handlers (route.js)', 'Express middleware', 'API Sockets', 'Controllers'], correctAnswer: 'Route Handlers (route.js)' },
    { question: 'Which file defines dynamic metadata tags (title, description) in App Router?', options: ['export const metadata = {} in layout/page', '<Head>', 'next.config.js', 'meta.json'], correctAnswer: 'export const metadata = {} in layout/page' },
    { question: 'Which configuration file manages Next.js build settings?', options: ['next.config.js', 'tsconfig.json', 'package.json', 'vercel.json'], correctAnswer: 'next.config.js' },
    { question: 'What company develops and maintains Next.js?', options: ['Vercel', 'Meta', 'Google', 'Netlify'], correctAnswer: 'Vercel' },
    { question: 'What process hydrates server-rendered HTML into interactive client React nodes?', options: ['Hydration', 'Compilation', 'Transpilation', 'Bundling'], correctAnswer: 'Hydration' },
    { question: 'Which special file handles fallback loading states in App Router?', options: ['loading.jsx', 'spinner.jsx', 'fallback.jsx', 'wait.jsx'], correctAnswer: 'loading.jsx' },
    { question: 'Which special file handles boundary error catching in App Router?', options: ['error.jsx', 'catch.jsx', 'boundary.jsx', 'fault.jsx'], correctAnswer: 'error.jsx' },
    { question: 'Which special file handles 404 page rendering in Next.js App Router?', options: ['not-found.jsx', '404.jsx', 'missing.jsx', 'none.jsx'], correctAnswer: 'not-found.jsx' },
    { question: 'What environment variable prefix makes variables accessible in browser in Next.js?', options: ['NEXT_PUBLIC_', 'REACT_APP_', 'PUBLIC_', 'VITE_'], correctAnswer: 'NEXT_PUBLIC_' }
  ],

  'Tailwind CSS': [
    { question: 'What design methodology does Tailwind CSS follow?', options: ['Utility-first CSS', 'BEM methodology', 'Component-based CSS', 'Inline CSS'], correctAnswer: 'Utility-first CSS' },
    { question: 'Which utility class applies flexbox layout in Tailwind?', options: ['flex', 'display-flex', 'd-flex', 'layout-flex'], correctAnswer: 'flex' },
    { question: 'Which utility class sets text color to blue in Tailwind?', options: ['text-blue-500', 'color-blue', 'font-blue', 'text-color-blue'], correctAnswer: 'text-blue-500' },
    { question: 'Which utility class adds padding of 1rem (16px) on all sides in Tailwind?', options: ['p-4', 'padding-4', 'pad-16', 'p-16'], correctAnswer: 'p-4' },
    { question: 'Which utility class adds margin-top of 0.5rem (8px) in Tailwind?', options: ['mt-2', 'margin-top-2', 'm-t-8', 'mt-8'], correctAnswer: 'mt-2' },
    { question: 'Which modifier applies styles on hover state in Tailwind?', options: ['hover:bg-blue-600', 'onHover:bg-blue-600', ':hover-bg-blue-600', 'bg-blue-600-hover'], correctAnswer: 'hover:bg-blue-600' },
    { question: 'Which breakpoint prefix targets medium screen sizes (768px+) in Tailwind?', options: ['md:', 'medium:', 'tab:', 'tablet:'], correctAnswer: 'md:' },
    { question: 'Which modifier applies dark mode styling in Tailwind?', options: ['dark:bg-slate-900', 'night:bg-slate-900', 'theme-dark:bg-slate-900', 'is-dark:bg-slate-900'], correctAnswer: 'dark:bg-slate-900' },
    { question: 'Which config file customizes colors, fonts, and theme extensions in Tailwind?', options: ['tailwind.config.js', 'styles.config.js', 'postcss.config.js', 'theme.json'], correctAnswer: 'tailwind.config.js' },
    { question: 'Which CSS directive injects Tailwind base styles in main stylesheet?', options: ['@import "tailwindcss"; or @tailwind base;', '@use tailwind;', '#include tailwind', 'import tailwind'], correctAnswer: '@import "tailwindcss"; or @tailwind base;' },
    { question: 'Which directive bundles multiple utility classes into a single CSS rule in Tailwind?', options: ['@apply', '@extend', '@mixin', '@include'], correctAnswer: '@apply' },
    { question: 'Which utility class rounds element borders fully into a pill shape?', options: ['rounded-full', 'border-circle', 'radius-full', 'rounded-pill'], correctAnswer: 'rounded-full' },
    { question: 'Which utility class sets element text font weight to bold?', options: ['font-bold', 'text-bold', 'weight-bold', 'b-bold'], correctAnswer: 'font-bold' },
    { question: 'Which utility class centers text horizontally in Tailwind?', options: ['text-center', 'align-center', 'content-center', 'justify-center'], correctAnswer: 'text-center' },
    { question: 'Which utility class creates CSS Grid layout container in Tailwind?', options: ['grid', 'display-grid', 'd-grid', 'grid-container'], correctAnswer: 'grid' },
    { question: 'Which utility class sets 3 equal-width columns in a Tailwind grid?', options: ['grid-cols-3', 'cols-3', 'grid-3', 'repeat-cols-3'], correctAnswer: 'grid-cols-3' },
    { question: 'Which utility class sets 1rem gap between flex or grid items in Tailwind?', options: ['gap-4', 'space-4', 'grid-gap-4', 'item-gap-4'], correctAnswer: 'gap-4' },
    { question: 'Which utility class hides an element from DOM layout in Tailwind?', options: ['hidden', 'invisible', 'display-none', 'none'], correctAnswer: 'hidden' },
    { question: 'Which utility class adds smooth transition timing to hover effects in Tailwind?', options: ['transition', 'animate-smooth', 'hover-transition', 'ease-all'], correctAnswer: 'transition' },
    { question: 'Which utility class sets element position to absolute in Tailwind?', options: ['absolute', 'pos-absolute', 'position-abs', 'abs'], correctAnswer: 'absolute' }
  ],

  'Express.js': [
    { question: 'What is Express.js?', options: ['Fast, minimalist web framework for Node.js', 'Database management system', 'Frontend React library', 'CSS framework'], correctAnswer: 'Fast, minimalist web framework for Node.js' },
    { question: 'How do you create an Express application instance in Node.js?', options: ['const app = express()', 'const app = new Express()', 'const app = Express.create()', 'const app = express.init()'], correctAnswer: 'const app = express()' },
    { question: 'Which function handles HTTP GET requests in Express.js?', options: ['app.get(path, handler)', 'app.fetch(path, handler)', 'app.routeGet(path, handler)', 'app.read(path, handler)'], correctAnswer: 'app.get(path, handler)' },
    { question: 'Which function handles HTTP POST requests in Express.js?', options: ['app.post(path, handler)', 'app.create(path, handler)', 'app.put(path, handler)', 'app.send(path, handler)'], correctAnswer: 'app.post(path, handler)' },
    { question: 'What is middleware in Express.js?', options: ['Functions that execute during request-response cycle before reaching route handler', 'Database ORM layer', 'Frontend rendering template', 'CSS processor'], correctAnswer: 'Functions that execute during request-response cycle before reaching route handler' },
    { question: 'Which arguments are passed to standard Express middleware functions?', options: ['(req, res, next)', '(request, response)', '(ctx, next)', '(err, req, res)'], correctAnswer: '(req, res, next)' },
    { question: 'Which function passes control to the next middleware in Express?', options: ['next()', 'continue()', 'forward()', 'pass()'], correctAnswer: 'next()' },
    { question: 'Which built-in middleware parses incoming JSON request bodies in modern Express?', options: ['express.json()', 'body-parser-json()', 'express.parseJSON()', 'jsonMiddleware()'], correctAnswer: 'express.json()' },
    { question: 'Which method sends a JSON response payload in Express.js?', options: ['res.json(data)', 'res.sendJSON(data)', 'res.write(data)', 'res.output(data)'], correctAnswer: 'res.json(data)' },
    { question: 'Which method sets HTTP status code before sending response in Express?', options: ['res.status(code)', 'res.setCode(code)', 'res.httpCode(code)', 'res.statusCode(code)'], correctAnswer: 'res.status(code)' },
    { question: 'Which property accesses URL route parameters (e.g. /users/:id) in Express?', options: ['req.params', 'req.query', 'req.body', 'req.urlParams'], correctAnswer: 'req.params' },
    { question: 'Which property accesses URL query string parameters (e.g. ?search=term) in Express?', options: ['req.query', 'req.params', 'req.body', 'req.queryString'], correctAnswer: 'req.query' },
    { question: 'Which property accesses request payload data sent in POST/PUT in Express?', options: ['req.body', 'req.data', 'req.payload', 'req.content'], correctAnswer: 'req.body' },
    { question: 'Which class isolates modular route handlers in Express.js?', options: ['express.Router()', 'express.RouteGroup()', 'express.Module()', 'express.Controller()'], correctAnswer: 'express.Router()' },
    { question: 'Which method registers global middleware in Express?', options: ['app.use(middleware)', 'app.add(middleware)', 'app.register(middleware)', 'app.plugin(middleware)'], correctAnswer: 'app.use(middleware)' },
    { question: 'Which method serves static files (images, CSS, HTML) in Express?', options: ['express.static(folderPath)', 'express.files(folderPath)', 'express.assets(folderPath)', 'express.public(folderPath)'], correctAnswer: 'express.static(folderPath)' },
    { question: 'How do you define an error-handling middleware function in Express?', options: ['Four parameters: (err, req, res, next)', 'Three parameters: (err, req, res)', 'Using app.error()', 'Using try/catch block only'], correctAnswer: 'Four parameters: (err, req, res, next)' },
    { question: 'Which middleware security package sets HTTP security headers in Express apps?', options: ['helmet', 'cors', 'morgan', 'dotenv'], correctAnswer: 'helmet' },
    { question: 'Which middleware logs incoming HTTP requests to server console in Express?', options: ['morgan', 'winston', 'bunyan', 'debug'], correctAnswer: 'morgan' },
    { question: 'Which method starts the server listening on a specified port in Express?', options: ['app.listen(port, callback)', 'app.start(port)', 'app.run(port)', 'app.serve(port)'], correctAnswer: 'app.listen(port, callback)' }
  ],

  'Django': [
    { question: 'What architectural pattern does Django follow?', options: ['Model-Template-View (MTV)', 'Model-View-Controller (MVC)', 'Flux architecture', 'Monolithic SPA'], correctAnswer: 'Model-Template-View (MTV)' },
    { question: 'Which CLI command creates a new Django project directory?', options: ['django-admin startproject projectname', 'django create projectname', 'python -m django new', 'django init'], correctAnswer: 'django-admin startproject projectname' },
    { question: 'Which command creates a modular application inside a Django project?', options: ['python manage.py startapp appname', 'django-admin makeapp appname', 'python manage.py createapp', 'django start app'], correctAnswer: 'python manage.py startapp appname' },
    { question: 'Which command generates database migration files from models.py changes in Django?', options: ['python manage.py makemigrations', 'python manage.py migrate', 'python manage.py db_schema', 'django-admin migrate'], correctAnswer: 'python manage.py makemigrations' },
    { question: 'Which command executes migration files to update database schema in Django?', options: ['python manage.py migrate', 'python manage.py runmigrations', 'python manage.py db_sync', 'django-admin update'], correctAnswer: 'python manage.py migrate' },
    { question: 'Which file defines database data models in Django apps?', options: ['models.py', 'schema.py', 'database.py', 'views.py'], correctAnswer: 'models.py' },
    { question: 'Which file handles request logic and returns HTTP responses or templates in Django?', options: ['views.py', 'controllers.py', 'routes.py', 'handlers.py'], correctAnswer: 'views.py' },
    { question: 'Which file maps URL patterns to view functions in Django?', options: ['urls.py', 'routes.py', 'navigation.py', 'endpoints.py'], correctAnswer: 'urls.py' },
    { question: 'Which built-in command creates a superuser admin account in Django?', options: ['python manage.py createsuperuser', 'django-admin adduser', 'python manage.py make_admin', 'django admin user'], correctAnswer: 'python manage.py createsuperuser' },
    { question: 'What built-in feature provides an instant Web UI for managing data in Django?', options: ['Django Admin Site', 'Django Dashboard', 'Django Workbench', 'Django Studio'], correctAnswer: 'Django Admin Site' },
    { question: 'Which ORM query method fetches all records from a Django model?', options: ['Model.objects.all()', 'Model.find()', 'Model.get_all()', 'Model.select()'], correctAnswer: 'Model.objects.all()' },
    { question: 'Which ORM query method filters records matching conditions in Django?', options: ['Model.objects.filter(...)', 'Model.objects.where(...)', 'Model.search(...)', 'Model.query(...)'], correctAnswer: 'Model.objects.filter(...)' },
    { question: 'Which ORM query method retrieves a single matching record or raises DoesNotExist in Django?', options: ['Model.objects.get(...)', 'Model.objects.find_one(...)', 'Model.objects.first(...)', 'Model.fetch(...)'], correctAnswer: 'Model.objects.get(...)' },
    { question: 'What template syntax inserts variable values inside Django HTML templates?', options: ['{{ variable }}', '{% variable %}', '${ variable }', '<%= variable %>'], correctAnswer: '{{ variable }}' },
    { question: 'What template syntax executes logic tags (for loops, if conditions) in Django templates?', options: ['{% tag %}', '{{ tag }}', '<% tag %>', '[$ tag $]'], correctAnswer: '{% tag %}' },
    { question: 'Which popular toolkit extends Django for building RESTful APIs?', options: ['Django REST Framework (DRF)', 'FastAPI-Django', 'Django WebAPI', 'Django GraphQL'], correctAnswer: 'Django REST Framework (DRF)' },
    { question: 'What DRF class converts complex QuerySets and models into JSON payloads?', options: ['Serializer', 'Transformer', 'Converter', 'JsonResponse'], correctAnswer: 'Serializer' },
    { question: 'Which protection feature prevents cross-site request forgery in Django forms?', options: ['CSRF Token ({% csrf_token %})', 'CORS Middleware', 'XSS Filter', 'JWT Auth'], correctAnswer: 'CSRF Token ({% csrf_token %})' },
    { question: 'Which file contains global project configurations, installed apps, and database credentials in Django?', options: ['settings.py', 'config.py', 'django.conf', 'app.config'], correctAnswer: 'settings.py' },
    { question: 'Which command launches the built-in development web server in Django?', options: ['python manage.py runserver', 'django start', 'python server.py', 'django-admin serve'], correctAnswer: 'python manage.py runserver' }
  ],

  'Go (Golang)': [
    { question: 'Who developed the Go (Golang) programming language?', options: ['Google', 'Microsoft', 'Apple', 'Meta'], correctAnswer: 'Google' },
    { question: 'Which keyword defines package namespace at top of Go source files?', options: ['package', 'module', 'namespace', 'import'], correctAnswer: 'package' },
    { question: 'Which package entry point function executes Go executable programs?', options: ['func main() inside package main', 'func start()', 'func init()', 'func Run()'], correctAnswer: 'func main() inside package main' },
    { question: 'Which shorthand operator performs variable declaration and type-inferred assignment in Go?', options: [':=', '=', '::', 'var'], correctAnswer: ':=' },
    { question: 'Which keyword creates lightweight concurrent execution threads in Go?', options: ['go', 'async', 'thread', 'routine'], correctAnswer: 'go' },
    { question: 'What built-in feature facilitates communication and synchronization between goroutines in Go?', options: ['Channels (chan)', 'Pointers', 'Mutexes', 'Futures'], correctAnswer: 'Channels (chan)' },
    { question: 'Which primitive data structure groups typed fields together in Go?', options: ['struct', 'class', 'object', 'interface'], correctAnswer: 'struct' },
    { question: 'How do you define methods associated with a struct in Go?', options: ['func (r Receiver) MethodName()', 'struct.MethodName()', 'class.method()', 'func MethodName(this Struct)'], correctAnswer: 'func (r Receiver) MethodName()' },
    { question: 'Which built-in type represents dynamic resizable arrays in Go?', options: ['Slice', 'Array', 'Vector', 'List'], correctAnswer: 'Slice' },
    { question: 'Which built-in function appends elements to a slice in Go?', options: ['append(slice, element)', 'slice.add(element)', 'push(slice, element)', 'slice.concat(element)'], correctAnswer: 'append(slice, element)' },
    { question: 'Which built-in data type stores key-value pairs in Go?', options: ['map[KeyType]ValueType', 'dict[K]V', 'HashMap<K,V>', 'table[K]V'], correctAnswer: 'map[KeyType]ValueType' },
    { question: 'How does Go handle errors idiomatically?', options: ['Functions return error as last return value', 'Using try/catch blocks', 'Using exception handlers', 'Raising panics only'], correctAnswer: 'Functions return error as last return value' },
    { question: 'Which operator dereferences a pointer variable in Go?', options: ['*', '&', '->', '.'], correctAnswer: '*' },
    { question: 'Which operator retrieves memory address of a variable in Go?', options: ['&', '*', 'addr()', 'ptr()'], correctAnswer: '&' },
    { question: 'Which keyword defers function call execution until surrounding function returns in Go?', options: ['defer', 'delay', 'finally', 'wait'], correctAnswer: 'defer' },
    { question: 'Which interface in standard library formats text and prints output in Go?', options: ['fmt package (fmt.Println)', 'io.Print', 'std.out', 'console.Log'], correctAnswer: 'fmt package (fmt.Println)' },
    { question: 'Which CLI command builds and runs Go code directly?', options: ['go run main.go', 'go execute', 'go start', 'go build-run'], correctAnswer: 'go run main.go' },
    { question: 'Which command compiles Go source code into executable binary file?', options: ['go build', 'go compile', 'go make', 'go pack'], correctAnswer: 'go build' },
    { question: 'Which command initializes Go modules for dependency management in modern Go?', options: ['go mod init module_name', 'go init', 'go package create', 'go dep init'], correctAnswer: 'go mod init module_name' },
    { question: 'What keyword defines abstract method set contracts in Go?', options: ['interface', 'protocol', 'trait', 'abstract class'], correctAnswer: 'interface' }
  ],

  'Rust': [
    { question: 'What primary safety guarantee sets Rust apart from other systems languages?', options: ['Memory safety without garbage collector', 'Automatic garbage collection', 'Dynamic type coercion', 'Interpreted execution'], correctAnswer: 'Memory safety without garbage collector' },
    { question: 'Which memory management system controls variable lifetimes in Rust?', options: ['Ownership and Borrowing rules', 'Garbage Collector', 'Manual malloc/free only', 'Reference Counting only'], correctAnswer: 'Ownership and Borrowing rules' },
    { question: 'Which CLI build tool and package manager comes with Rust?', options: ['Cargo', 'npm', 'pip', 'crates'], correctAnswer: 'Cargo' },
    { question: 'Which manifest file manages Rust project metadata and dependencies?', options: ['Cargo.toml', 'rust.json', 'package.toml', 'cargo.config'], correctAnswer: 'Cargo.toml' },
    { question: 'Which keyword declares variables in Rust?', options: ['let', 'var', 'mut', 'const'], correctAnswer: 'let' },
    { question: 'Are variables mutable or immutable by default in Rust?', options: ['Immutable by default (requires mut for mutation)', 'Mutable by default', 'Always constant', 'Volatile'], correctAnswer: 'Immutable by default (requires mut for mutation)' },
    { question: 'Which keyword makes a variable mutable in Rust?', options: ['mut', 'mutable', 'var', 'change'], correctAnswer: 'mut' },
    { question: 'Which symbol represents an immutable reference borrowing a value in Rust?', options: ['&T', '&mut T', '*T', 'borrow T'], correctAnswer: '&T' },
    { question: 'Which symbol represents a mutable reference borrowing a value in Rust?', options: ['&mut T', '&T', '*mut T', 'ref mut T'], correctAnswer: '&mut T' },
    { question: 'Which macro prints formatted output strings to console in Rust?', options: ['println!', 'print_line()', 'printf!', 'console.log!'], correctAnswer: 'println!' },
    { question: 'Which enum handles optional values without null pointers in Rust?', options: ['Option<T> (Some(T) or None)', 'Nullable<T>', 'Maybe<T>', 'Result<T>'], correctAnswer: 'Option<T> (Some(T) or None)' },
    { question: 'Which enum handles operations that can succeed or fail in Rust?', options: ['Result<T, E> (Ok(T) or Err(E))', 'Option<T>', 'Status<T>', 'Try<T>'], correctAnswer: 'Result<T, E> (Ok(T) or Err(E))' },
    { question: 'Which operator short-circuits error propagation in Rust Result/Option returning functions?', options: ['?', '!', '*', '->'], correctAnswer: '?' },
    { question: 'Which construct performs pattern matching over enums and values in Rust?', options: ['match', 'switch', 'select', 'if let'], correctAnswer: 'match' },
    { question: 'Which block executes code implementation for a struct or enum in Rust?', options: ['impl StructName {}', 'class StructName {}', 'extend StructName {}', 'body StructName {}'], correctAnswer: 'impl StructName {}' },
    { question: 'What features define shared behavior interfaces across types in Rust?', options: ['Traits', 'Interfaces', 'Protocols', 'Abstract classes'], correctAnswer: 'Traits' },
    { question: 'Which command builds and runs Rust cargo projects?', options: ['cargo run', 'cargo start', 'rustc run', 'cargo execute'], correctAnswer: 'cargo run' },
    { question: 'Which command checks code for errors without generating binary artifacts in Rust?', options: ['cargo check', 'cargo verify', 'cargo inspect', 'cargo test'], correctAnswer: 'cargo check' },
    { question: 'Which keyword allows writing raw pointers and memory manipulations outside safety checks in Rust?', options: ['unsafe', 'raw', 'danger', 'native'], correctAnswer: 'unsafe' },
    { question: 'What is an individual published library package called in Rust ecosystem?', options: ['Crate', 'Gem', 'Module', 'Package'], correctAnswer: 'Crate' }
  ],

  'Ruby on Rails': [
    { question: 'What programming language is Ruby on Rails written in?', options: ['Ruby', 'Python', 'JavaScript', 'Elixir'], correctAnswer: 'Ruby' },
    { question: 'What software design paradigm guides Ruby on Rails architecture?', options: ['Convention over Configuration (CoC) and DRY', 'Explicit Configuration', 'Functional purity', 'Microservices first'], correctAnswer: 'Convention over Configuration (CoC) and DRY' },
    { question: 'Which architectural pattern does Ruby on Rails follow?', options: ['Model-View-Controller (MVC)', 'MTV', 'Flux', 'MVVM'], correctAnswer: 'Model-View-Controller (MVC)' },
    { question: 'Which component represents database tables and business logic in Rails?', options: ['Active Record', 'Action Controller', 'Action View', 'Active Model'], correctAnswer: 'Active Record' },
    { question: 'Which CLI command creates a new Ruby on Rails web application?', options: ['rails new appname', 'ruby create appname', 'rails init appname', 'gem new appname'], correctAnswer: 'rails new appname' },
    { question: 'Which command generates scaffolding (models, views, controllers, migrations) in Rails?', options: ['rails generate scaffold model_name', 'rails make scaffold', 'rails create all', 'ruby generate scaffold'], correctAnswer: 'rails generate scaffold model_name' },
    { question: 'Which command executes pending database migrations in Rails?', options: ['rails db:migrate', 'rake migrate', 'rails migrate', 'Both rails db:migrate and rake migrate'], correctAnswer: 'Both rails db:migrate and rake migrate' },
    { question: 'Which file maps incoming HTTP requests to controller actions in Rails?', options: ['config/routes.rb', 'config/urls.rb', 'app/routes.rb', 'routes.js'], correctAnswer: 'config/routes.rb' },
    { question: 'Which template format renders ERB HTML tags in Rails views?', options: ['.html.erb', '.erb.html', '.blade.php', '.jsx'], correctAnswer: '.html.erb' },
    { question: 'What tag syntax evaluates Ruby code and outputs result into HTML ERB view?', options: ['<%= ruby_code %>', '<% ruby_code %>', '{{ ruby_code }}', '${ ruby_code }'], correctAnswer: '<%= ruby_code %>' },
    { question: 'What command launches interactive Ruby debug console loaded with Rails environment?', options: ['rails console (or rails c)', 'ruby console', 'rails debug', 'irb rails'], correctAnswer: 'rails console (or rails c)' },
    { question: 'Which Active Record method retrieves all records from a table in Rails?', options: ['Model.all', 'Model.find_all', 'Model.select_all', 'Model.get'], correctAnswer: 'Model.all' },
    { question: 'Which Active Record method retrieves a single record by primary key ID in Rails?', options: ['Model.find(id)', 'Model.get(id)', 'Model.by_id(id)', 'Model.search(id)'], correctAnswer: 'Model.find(id)' },
    { question: 'Which Active Record association sets up one-to-many child relationships in Rails?', options: ['has_many', 'belongs_to', 'has_one', 'has_and_belongs_to_many'], correctAnswer: 'has_many' },
    { question: 'Which Active Record association sets up child-to-parent reference in Rails?', options: ['belongs_to', 'has_many', 'references', 'child_of'], correctAnswer: 'belongs_to' },
    { question: 'What package manager distributes Ruby gems and Rails plugins?', options: ['RubyGems / Bundler', 'npm', 'pip', 'Composer'], correctAnswer: 'RubyGems / Bundler' },
    { question: 'Which file specifies Ruby gem dependencies in Rails projects?', options: ['Gemfile', 'packages.config', 'gems.json', 'dependencies.rb'], correctAnswer: 'Gemfile' },
    { question: 'Which command launches development web server in Rails?', options: ['rails server (or rails s)', 'ruby server', 'rails start', 'puma start'], correctAnswer: 'rails server (or rails s)' },
    { question: 'Which framework component handles HTTP requests and renders responses in Rails?', options: ['Action Controller', 'Active Record', 'Action Mailer', 'Action View'], correctAnswer: 'Action Controller' },
    { question: 'What security feature protects Rails forms from cross-site request forgery?', options: ['protect_from_forgery / authenticity_token', 'CORS policy', 'SSL certificates', 'JWT tokens'], correctAnswer: 'protect_from_forgery / authenticity_token' }
  ],

  'Redis': [
    { question: 'What primary type of database store is Redis?', options: ['In-memory key-value data structure store', 'Relational SQL database', 'Document database', 'Graph store'], correctAnswer: 'In-memory key-value data structure store' },
    { question: 'Why is Redis extremely fast for read and write operations?', options: ['Data is stored directly in RAM memory', 'It uses solid state drives only', 'It skips authentication', 'It compiles queries to machine code'], correctAnswer: 'Data is stored directly in RAM memory' },
    { question: 'Which command sets a key to store a string value in Redis?', options: ['SET key value', 'PUT key value', 'ADD key value', 'STORE key value'], correctAnswer: 'SET key value' },
    { question: 'Which command retrieves value stored at a key in Redis?', options: ['GET key', 'READ key', 'FETCH key', 'SELECT key'], correctAnswer: 'GET key' },
    { question: 'Which command deletes a key from Redis?', options: ['DEL key', 'REMOVE key', 'DROP key', 'CLEAR key'], correctAnswer: 'DEL key' },
    { question: 'Which command sets key expiration time in seconds in Redis?', options: ['EXPIRE key seconds', 'TTL key seconds', 'TIMEOUT key seconds', 'SETEXP key seconds'], correctAnswer: 'EXPIRE key seconds' },
    { question: 'Which command checks remaining time-to-live for a key in seconds in Redis?', options: ['TTL key', 'EXPIRE key', 'TIME key', 'CHECK_TTL key'], correctAnswer: 'TTL key' },
    { question: 'Which CLI tool connects interactively to Redis server?', options: ['redis-cli', 'redis-shell', 'redisterm', 'redis-admin'], correctAnswer: 'redis-cli' },
    { question: 'Which command increments integer value stored at key by 1 in Redis?', options: ['INCR key', 'ADD1 key', 'PLUS key', 'COUNT key'], correctAnswer: 'INCR key' },
    { question: 'Which data structure allows pushing items to head or tail of a list in Redis?', options: ['Lists (LPUSH / RPUSH)', 'Sets', 'Hashes', 'Bitmaps'], correctAnswer: 'Lists (LPUSH / RPUSH)' },
    { question: 'Which data structure stores unique unordered elements in Redis?', options: ['Sets (SADD / SMEMBERS)', 'Lists', 'Hashes', 'Strings'], correctAnswer: 'Sets (SADD / SMEMBERS)' },
    { question: 'Which data structure maps field-value pairs inside a single Redis key?', options: ['Hashes (HSET / HGET)', 'Lists', 'Sets', 'Streams'], correctAnswer: 'Hashes (HSET / HGET)' },
    { question: 'Which data structure maintains elements ordered by floating-point scores in Redis?', options: ['Sorted Sets (ZADD)', 'Hashes', 'Lists', 'Bitmaps'], correctAnswer: 'Sorted Sets (ZADD)' },
    { question: 'What messaging pattern enables real-time message broadcasting in Redis?', options: ['Pub/Sub (PUBLISH / SUBSCRIBE)', 'Queueing', 'WebSockets', 'REST Webhooks'], correctAnswer: 'Pub/Sub (PUBLISH / SUBSCRIBE)' },
    { question: 'What persistence mechanism takes point-in-time snapshots of Redis dataset?', options: ['RDB (Redis Database Snapshots)', 'AOF', 'RAM Dump', 'MemSnap'], correctAnswer: 'RDB (Redis Database Snapshots)' },
    { question: 'What persistence mechanism logs every write command received by Redis server?', options: ['AOF (Append Only File)', 'RDB', 'Journaling', 'SyncLog'], correctAnswer: 'AOF (Append Only File)' },
    { question: 'What feature distributes key data across multiple Redis nodes automatically?', options: ['Redis Cluster', 'Redis Sentinel', 'Redis Master-Slave', 'Redis Proxy'], correctAnswer: 'Redis Cluster' },
    { question: 'What solution provides high availability and automatic failover monitoring for Redis?', options: ['Redis Sentinel', 'Redis Proxy', 'Redis Load Balancer', 'Redis Keeper'], correctAnswer: 'Redis Sentinel' },
    { question: 'Which command checks server health response in Redis?', options: ['PING (returns PONG)', 'CHECK', 'HEALTH', 'STATUS'], correctAnswer: 'PING (returns PONG)' },
    { question: 'Which command clears all keys across all databases in Redis?', options: ['FLUSHALL', 'CLEARALL', 'DROPALL', 'RESETALL'], correctAnswer: 'FLUSHALL' }
  ],

  'Docker & DevOps': [
    { question: 'What is Docker used for in software development?', options: ['Containerizing applications with dependencies into portable units', 'Writing source code', 'Managing physical network cables', 'Designing graphics'], correctAnswer: 'Containerizing applications with dependencies into portable units' },
    { question: 'What file contains instructions to assemble a Docker container image?', options: ['Dockerfile', 'Docker.config', 'Containerfile.json', 'docker-build.txt'], correctAnswer: 'Dockerfile' },
    { question: 'Which command builds a Docker image from a Dockerfile?', options: ['docker build -t image_name .', 'docker create-image', 'docker compile', 'docker make'], correctAnswer: 'docker build -t image_name .' },
    { question: 'Which command launches a running container from a Docker image?', options: ['docker run -d -p host:container image_name', 'docker start-image', 'docker launch', 'docker execute'], correctAnswer: 'docker run -d -p host:container image_name' },
    { question: 'Which command lists currently active running Docker containers?', options: ['docker ps', 'docker list', 'docker containers', 'docker status'], correctAnswer: 'docker ps' },
    { question: 'Which command stops a running Docker container gracefully?', options: ['docker stop container_id', 'docker kill', 'docker halt', 'docker end'], correctAnswer: 'docker stop container_id' },
    { question: 'Which tool orchestrates multi-container Docker applications via YAML config?', options: ['Docker Compose (docker-compose.yml)', 'Kubernetes', 'Swarm', 'Vagrant'], correctAnswer: 'Docker Compose (docker-compose.yml)' },
    { question: 'Which CLI command starts multi-container services defined in docker-compose.yml?', options: ['docker compose up -d', 'docker-compose start', 'docker run compose', 'docker init-all'], correctAnswer: 'docker compose up -d' },
    { question: 'What cloud registry hosts public and private Docker container images?', options: ['Docker Hub', 'GitHub Gist', 'npm registry', 'AWS S3'], correctAnswer: 'Docker Hub' },
    { question: 'What is the main difference between Docker containers and Virtual Machines?', options: ['Containers share host OS kernel and are lightweight', 'Containers carry full guest OS', 'VMs run faster than containers', 'Containers require hypervisors'], correctAnswer: 'Containers share host OS kernel and are lightweight' },
    { question: 'What open-source system automates container deployment, scaling, and management at scale?', options: ['Kubernetes (K8s)', 'Docker Compose', 'Jenkins', 'Terraform'], correctAnswer: 'Kubernetes (K8s)' },
    { question: 'What practice automates code building, testing, and deployment pipeline delivery?', options: ['CI/CD (Continuous Integration / Continuous Deployment)', 'Agile Sprinting', 'Scrum Development', 'TDD'], correctAnswer: 'CI/CD (Continuous Integration / Continuous Deployment)' },
    { question: 'What Infrastructure as Code (IaC) tool provisions cloud resources via declarative config files?', options: ['Terraform', 'Docker', 'Ansible', 'Jenkins'], correctAnswer: 'Terraform' },
    { question: 'What IT automation engine automates configuration management via Playbooks?', options: ['Ansible', 'Puppet', 'Chef', 'Terraform'], correctAnswer: 'Ansible' },
    { question: 'Which Dockerfile instruction specifies the base parent container image?', options: ['FROM', 'BASE', 'IMAGE', 'ROOT'], correctAnswer: 'FROM' },
    { question: 'Which Dockerfile instruction sets default executable command for running container?', options: ['CMD or ENTRYPOINT', 'RUN', 'EXEC', 'START'], correctAnswer: 'CMD or ENTRYPOINT' },
    { question: 'Which Dockerfile instruction copies files from host into container image during build?', options: ['COPY (or ADD)', 'PUSH', 'TRANSFER', 'FETCH'], correctAnswer: 'COPY (or ADD)' },
    { question: 'Which Dockerfile instruction executes shell commands during image build process?', options: ['RUN', 'CMD', 'EXEC', 'DO'], correctAnswer: 'RUN' },
    { question: 'Which command opens interactive bash/sh terminal session inside running container?', options: ['docker exec -it container_id bash', 'docker open container_id', 'docker connect container_id', 'docker terminal container_id'], correctAnswer: 'docker exec -it container_id bash' },
    { question: 'What mechanism provides persistent data storage outside container lifecycle in Docker?', options: ['Docker Volumes', 'Container RAM', 'Tmpfs', 'Image layers'], correctAnswer: 'Docker Volumes' }
  ],

  'Flutter & Dart': [
    { question: 'Which programming language powers Flutter framework applications?', options: ['Dart', 'Kotlin', 'Swift', 'Java'], correctAnswer: 'Dart' },
    { question: 'Who developed Flutter and Dart?', options: ['Google', 'Meta', 'Apple', 'Microsoft'], correctAnswer: 'Google' },
    { question: 'What architectural building blocks form UI elements in Flutter?', options: ['Widgets', 'Components', 'Views', 'Elements'], correctAnswer: 'Widgets' },
    { question: 'What distinguishes StatelessWidget from StatefulWidget in Flutter?', options: ['StatefulWidget can mutate state dynamically; StatelessWidget is immutable', 'StatelessWidget has animation engine', 'StatefulWidget renders faster', 'StatelessWidget cannot accept parameters'], correctAnswer: 'StatefulWidget can mutate state dynamically; StatelessWidget is immutable' },
    { question: 'Which method returns rendering layout structure inside a Flutter widget?', options: ['build(BuildContext context)', 'render()', 'createView()', 'draw()'], correctAnswer: 'build(BuildContext context)' },
    { question: 'Which function triggers UI re-render upon state change inside a StatefulWidget?', options: ['setState(() {})', 'updateState()', 'rebuild()', 'refreshUI()'], correctAnswer: 'setState(() {})' },
    { question: 'Which layout widget arranges child widgets vertically in Flutter?', options: ['Column', 'Row', 'Stack', 'ListView'], correctAnswer: 'Column' },
    { question: 'Which layout widget arranges child widgets horizontally in Flutter?', options: ['Row', 'Column', 'FlexRow', 'Container'], correctAnswer: 'Row' },
    { question: 'Which layout widget overlays children on top of each other along Z-axis in Flutter?', options: ['Stack', 'Layer', 'Overlay', 'DepthBox'], correctAnswer: 'Stack' },
    { question: 'Which top-level app widget implements Material Design visual layout structure in Flutter?', options: ['MaterialApp & Scaffold', 'CupertinoApp only', 'WidgetApp', 'MainScreen'], correctAnswer: 'MaterialApp & Scaffold' },
    { question: 'What package dependency management configuration file is used in Flutter?', options: ['pubspec.yaml', 'package.json', 'flutter.config', 'deps.yaml'], correctAnswer: 'pubspec.yaml' },
    { question: 'Which popular state management pattern utilizes Streams and Sinks in Flutter?', options: ['BLoC (Business Logic Component)', 'Redux', 'Provider', 'Riverpod'], correctAnswer: 'BLoC (Business Logic Component)' },
    { question: 'Which keyword handles asynchronous futures in Dart syntax?', options: ['async / await', 'defer / promise', 'then / wait', 'future / await'], correctAnswer: 'async / await' },
    { question: 'Which type represents a single asynchronous value computation in Dart?', options: ['Future<T>', 'Promise<T>', 'Stream<T>', 'Task<T>'], correctAnswer: 'Future<T>' },
    { question: 'Which type represents a continuous sequence of asynchronous events in Dart?', options: ['Stream<T>', 'Future<T>', 'Observable<T>', 'EventChannel<T>'], correctAnswer: 'Stream<T>' },
    { question: 'What feature provides instant code reload during app development in Flutter?', options: ['Hot Reload', 'Live Update', 'Fast Refresh', 'Quick Sync'], correctAnswer: 'Hot Reload' },
    { question: 'Which widget builds scrollable dynamic lists efficiently in Flutter?', options: ['ListView.builder', 'ScrollView', 'ColumnList', 'FlatList'], correctAnswer: 'ListView.builder' },
    { question: 'Which widget provides gesture detection (taps, double taps, drags) in Flutter?', options: ['GestureDetector (or InkWell)', 'TouchBox', 'ButtonArea', 'Clickable'], correctAnswer: 'GestureDetector (or InkWell)' },
    { question: 'Which feature in Dart prevents runtime null pointer errors at compile time?', options: ['Sound Null Safety', 'Optional Types', 'Null Checks', 'Strict Mode'], correctAnswer: 'Sound Null Safety' },
    { question: 'Which CLI command installs packages listed in pubspec.yaml in Flutter?', options: ['flutter pub get', 'flutter install', 'pub get', 'npm install'], correctAnswer: 'flutter pub get' }
  ],

  'Machine Learning Basics': [
    { question: 'What branch of Artificial Intelligence involves systems learning patterns from data?', options: ['Machine Learning', 'Rule-based Expert Systems', 'Quantum Computing', 'Procedural Code'], correctAnswer: 'Machine Learning' },
    { question: 'Which learning paradigm uses labeled target output training data?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Self-Organizing Learning'], correctAnswer: 'Supervised Learning' },
    { question: 'Which learning paradigm finds hidden patterns/clusters in unlabeled data?', options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Semi-supervised Learning'], correctAnswer: 'Unsupervised Learning' },
    { question: 'Which task type predicts continuous numerical values (e.g. house prices)?', options: ['Regression', 'Classification', 'Clustering', 'Dimensionality Reduction'], correctAnswer: 'Regression' },
    { question: 'Which task type categorizes data into discrete class labels (e.g. Spam vs Not Spam)?', options: ['Classification', 'Regression', 'Clustering', 'Estimation'], correctAnswer: 'Classification' },
    { question: 'Which Python library is standard for classical Machine Learning algorithms (trees, SVMs)?', options: ['Scikit-Learn (sklearn)', 'TensorFlow', 'PyTorch', 'OpenCV'], correctAnswer: 'Scikit-Learn (sklearn)' },
    { question: 'What metric measures the proportion of correct predictions out of total samples?', options: ['Accuracy', 'Precision', 'Recall', 'MSE'], correctAnswer: 'Accuracy' },
    { question: 'What problem occurs when a model performs extremely well on training data but poorly on test data?', options: ['Overfitting', 'Underfitting', 'Generalization', 'Convergence'], correctAnswer: 'Overfitting' },
    { question: 'What problem occurs when a model is too simple to capture underlying data relationships?', options: ['Underfitting', 'Overfitting', 'High Variance', 'Bias-Variance Balance'], correctAnswer: 'Underfitting' },
    { question: 'Which technique splits dataset into distinct Training and Testing subsets?', options: ['train_test_split()', 'data_divider()', 'sample_split()', 'k_fold_partition()'], correctAnswer: 'train_test_split()' },
    { question: 'Which clustering algorithm partitions data into K predefined cluster groups?', options: ['K-Means Clustering', 'KNN', 'Decision Trees', 'Linear Regression'], correctAnswer: 'K-Means Clustering' },
    { question: 'Which supervised classification algorithm assigns labels based on majority vote of K nearest data points?', options: ['K-Nearest Neighbors (KNN)', 'K-Means', 'Random Forest', 'Naive Bayes'], correctAnswer: 'K-Nearest Neighbors (KNN)' },
    { question: 'Which algorithm combines an ensemble of multiple Decision Trees to improve prediction accuracy?', options: ['Random Forest', 'Linear Regression', 'Logistic Regression', 'Single Tree'], correctAnswer: 'Random Forest' },
    { question: 'Which algorithm models binary classification outcomes using a sigmoid function?', options: ['Logistic Regression', 'Linear Regression', 'K-Means', 'Linear Discriminant'], correctAnswer: 'Logistic Regression' },
    { question: 'What table evaluates classification model performance by comparing Actual vs Predicted counts?', options: ['Confusion Matrix', 'Scatter Plot', 'Correlation Matrix', 'Precision Table'], correctAnswer: 'Confusion Matrix' },
    { question: 'Which dimensionality reduction method transforms correlated features into uncorrelated principal components?', options: ['PCA (Principal Component Analysis)', 'LDA', 't-SNE', 'Factorization'], correctAnswer: 'PCA (Principal Component Analysis)' },
    { question: 'Which loss function measures average squared difference between estimated values and actual target in regression?', options: ['Mean Squared Error (MSE)', 'Cross-Entropy Loss', 'Binary Hinge Loss', 'Accuracy Error'], correctAnswer: 'Mean Squared Error (MSE)' },
    { question: 'What preprocessing step scales numerical feature values to a standard range (e.g. 0 to 1)?', options: ['Feature Scaling / Normalization', 'Feature Selection', 'Data Imputation', 'One-Hot Encoding'], correctAnswer: 'Feature Scaling / Normalization' },
    { question: 'What technique converts categorical string column values into binary dummy column vectors?', options: ['One-Hot Encoding', 'Label Encoding', 'Binarization', 'Vector Mapping'], correctAnswer: 'One-Hot Encoding' },
    { question: 'Which gradient optimization technique iteratively updates model parameters to minimize loss function?', options: ['Gradient Descent', 'Backpropagation', 'Grid Search', 'Cross-Validation'], correctAnswer: 'Gradient Descent' }
  ]
};


async function seedExpandedCatalog() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('--- SEEDING EXPANDED MULTI-DOMAIN CATALOG SKILLS & QUESTION BANKS ---');

  for (const sk of expandedSkillsCatalog) {
    let item = await Skill.findOne({ name: sk.name });
    if (!item) {
      item = await Skill.create(sk);
      console.log(`+ Created Master Catalog Skill: ${item.name} (${item.category})`);
    } else {
      console.log(`✔ Catalog Skill Exists: ${item.name} (${item.category})`);
    }

    const questionsToSeed = comprehensiveNewQuestions[sk.name] || [];
    if (questionsToSeed.length > 0) {
      let added = 0;
      let skipped = 0;
      for (const q of questionsToSeed) {
        const existing = await SkillQuestion.findOne({ skill: item._id, question: q.question });
        if (!existing) {
          await SkillQuestion.create({
            skill: item._id,
            skillName: item.name,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: `Standard ${item.name} fundamental question.`,
            difficulty: 'Basic',
            isActive: true
          });
          added++;
        } else {
          skipped++;
        }
      }
      const count = await SkillQuestion.countDocuments({ skill: item._id, isActive: true });
      console.log(`  └─ Questions for ${item.name}: ${count} active (Added: ${added}, Skipped: ${skipped})`);
    } else {
      console.log(`  └─ Note: Initial seed array pending for ${item.name} (Will require questions before quiz start).`);
    }
  }

  console.log('\n--- EXPANDED SEEDING COMPLETED ---');
  await mongoose.disconnect();
}

seedExpandedCatalog().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
