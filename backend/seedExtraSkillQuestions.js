const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');

const extraQuestions = {
  'Node.js': [
    { question: 'What runtime engine does Node.js use?', options: ['V8', 'SpiderMonkey', 'Chakra', 'JSCore'], correctAnswer: 'V8' },
    { question: 'Which built-in module is used to create HTTP servers in Node.js?', options: ['http', 'net', 'url', 'server'], correctAnswer: 'http' },
    { question: 'Which object represents the current Node.js process?', options: ['process', 'global', 'window', 'env'], correctAnswer: 'process' },
    { question: 'Which module handles file system operations in Node.js?', options: ['fs', 'file', 'path', 'io'], correctAnswer: 'fs' },
    { question: 'What is npm in Node.js ecosystem?', options: ['Node Package Manager', 'Node Programming Model', 'Node Parsing Module', 'Node Process Monitor'], correctAnswer: 'Node Package Manager' },
    { question: 'Which function imports CommonJS modules in Node.js?', options: ['require()', 'import()', 'include()', 'use()'], correctAnswer: 'require()' },
    { question: 'What does event loop do in Node.js?', options: ['Executes non-blocking async callbacks', 'Multi-threads CPU tasks', 'Compiles C++', 'Renders HTML'], correctAnswer: 'Executes non-blocking async callbacks' },
    { question: 'Which method reads file asynchronously in Node.js fs module?', options: ['fs.readFile()', 'fs.readFileSync()', 'fs.open()', 'fs.get()'], correctAnswer: 'fs.readFile()' },
    { question: 'What is package.json used for?', options: ['Project metadata and dependencies', 'CSS styles', 'Database schema', 'HTML structure'], correctAnswer: 'Project metadata and dependencies' },
    { question: 'Which keyword exports code in CommonJS module syntax?', options: ['module.exports', 'export default', 'public export', 'send'], correctAnswer: 'module.exports' },
    { question: 'What is Express.js in Node.js ecosystem?', options: ['Web app framework', 'Database', 'Template engine', 'Bundler'], correctAnswer: 'Web app framework' },
    { question: 'Which method defines a GET route handler in Express.js?', options: ['app.get()', 'app.post()', 'app.route()', 'app.listen()'], correctAnswer: 'app.get()' },
    { question: 'What is middleware in Express.js?', options: ['Functions with access to req, res and next', 'Database query', 'Frontend CSS', 'HTML template'], correctAnswer: 'Functions with access to req, res and next' },
    { question: 'Which function passes execution to next middleware in Express?', options: ['next()', 'continue()', 'proceed()', 'forward()'], correctAnswer: 'next()' },
    { question: 'Which core module parses file paths in Node.js?', options: ['path', 'url', 'dir', 'route'], correctAnswer: 'path' },
    { question: 'How do you access environment variables in Node.js?', options: ['process.env', 'global.env', 'env.get()', 'system.env'], correctAnswer: 'process.env' },
    { question: 'What is Buffer in Node.js?', options: ['Binary data handler', 'Text editor', 'Memory cache', 'UI button'], correctAnswer: 'Binary data handler' },
    { question: 'Which event listener handles uncaught exceptions in Node?', options: ['process.on("uncaughtException")', 'process.catch()', 'global.onError()', 'node.onException()'], correctAnswer: 'process.on("uncaughtException")' },
    { question: 'Which tool automatically restarts Node app when files change?', options: ['nodemon', 'npm start', 'node-runner', 'watch-node'], correctAnswer: 'nodemon' },
    { question: 'Which function starts an Express server listening on a port?', options: ['app.listen()', 'app.run()', 'app.start()', 'app.serve()'], correctAnswer: 'app.listen()' }
  ],
  'MongoDB': [
    { question: 'What type of database is MongoDB?', options: ['NoSQL Document Store', 'Relational SQL', 'Graph Database', 'Key-Value Memory Cache'], correctAnswer: 'NoSQL Document Store' },
    { question: 'In what format does MongoDB store documents internally?', options: ['BSON', 'JSON text', 'XML', 'CSV'], correctAnswer: 'BSON' },
    { question: 'What is a group of documents called in MongoDB?', options: ['Collection', 'Table', 'Row set', 'Schema'], correctAnswer: 'Collection' },
    { question: 'Which field is automatically generated as a primary key in MongoDB?', options: ['_id', 'id', 'uuid', 'pk'], correctAnswer: '_id' },
    { question: 'Which method inserts a single document in Mongoose/MongoDB?', options: ['insertOne() / create()', 'add()', 'put()', 'append()'], correctAnswer: 'insertOne() / create()' },
    { question: 'Which method finds documents matching a query in Mongoose?', options: ['find()', 'search()', 'get()', 'lookup()'], correctAnswer: 'find()' },
    { question: 'Which operator checks if a field value matches any item in an array in MongoDB query?', options: ['$in', '$eq', '$or', '$all'], correctAnswer: '$in' },
    { question: 'Which operator combines query conditions with OR logic in MongoDB?', options: ['$or', '$and', '$union', '$either'], correctAnswer: '$or' },
    { question: 'Which Mongoose method updates a single document by ID?', options: ['findByIdAndUpdate()', 'update()', 'modify()', 'saveOne()'], correctAnswer: 'findByIdAndUpdate()' },
    { question: 'What is Mongoose in Node.js ecosystem?', options: ['MongoDB ODM (Object Data Modeling) library', 'SQL driver', 'Web framework', 'Template engine'], correctAnswer: 'MongoDB ODM (Object Data Modeling) library' },
    { question: 'Which framework feature enables multi-stage data processing pipeline in MongoDB?', options: ['Aggregation Pipeline', 'JOIN query', 'MapReduce only', 'Sub-query'], correctAnswer: 'Aggregation Pipeline' },
    { question: 'Which stage operator filters documents in MongoDB aggregation?', options: ['$match', '$group', '$sort', '$project'], correctAnswer: '$match' },
    { question: 'Which stage operator groups documents by a field in MongoDB aggregation?', options: ['$group', '$match', '$combine', '$collect'], correctAnswer: '$group' },
    { question: 'Which method creates index for speed optimization in MongoDB?', options: ['createIndex()', 'addKey()', 'fastIndex()', 'optimize()'], correctAnswer: 'createIndex()' },
    { question: 'What does populate() do in Mongoose?', options: ['Replaces referenced ObjectId with actual document data', 'Fills empty fields', 'Seeds database', 'Renders HTML'], correctAnswer: 'Replaces referenced ObjectId with actual document data' },
    { question: 'Which operator increments a numerical field value in MongoDB update?', options: ['$inc', '$add', '$plus', '$sum'], correctAnswer: '$inc' },
    { question: 'Which operator adds an element to an array field in MongoDB update?', options: ['$push', '$add', '$append', '$insert'], correctAnswer: '$push' },
    { question: 'Which operator removes a field from a document in MongoDB update?', options: ['$unset', '$delete', '$remove', '$drop'], correctAnswer: '$unset' },
    { question: 'Which Mongoose method deletes a single document by ID?', options: ['findByIdAndDelete()', 'remove()', 'drop()', 'purge()'], correctAnswer: 'findByIdAndDelete()' },
    { question: 'What is MongoDB Atlas?', options: ['Cloud-hosted MongoDB database service', 'Desktop GUI tool', 'Local CLI shell', 'Node.js framework'], correctAnswer: 'Cloud-hosted MongoDB database service' }
  ]
};

async function seedMore() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const skillName of Object.keys(extraQuestions)) {
    let skill = await Skill.findOne({ name: skillName });
    if (!skill) {
      skill = await Skill.create({ name: skillName, category: 'Development', status: 'active' });
    }
    for (const q of extraQuestions[skillName]) {
      const existing = await SkillQuestion.findOne({ skill: skill._id, question: q.question });
      if (!existing) {
        await SkillQuestion.create({
          skill: skill._id,
          skillName: skill.name,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: `Standard ${skillName} core topic.`,
          difficulty: 'Basic',
          isActive: true
        });
      }
    }
    console.log(`✔ Seeded ${skillName}`);
  }
  process.exit(0);
}

seedMore().catch(err => {
  console.error(err);
  process.exit(1);
});
