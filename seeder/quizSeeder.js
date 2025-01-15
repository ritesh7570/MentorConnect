const mongoose = require("mongoose");
const Quiz = require("../models/quiz");
const Group = require("../models/group");
const logger = require("../utils/logger")("quizSeeder"); // Import logger
const { quizValidate } = require("../schemas/quizSchema");
const quizData = [
  // JavaScript Basics
  {
    title: "JavaScript Basics",
    questions: [
      {
        questionText:
          "What is the correct syntax for referring to an external script called 'script.js'?",
        options: [
          "<script src='script.js'>",
          "<script href='script.js'>",
          "<script name='script.js'>",
          "<script link='script.js'>",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "How do you create a function in JavaScript?",
        options: [
          "function myFunction()",
          "function:myFunction()",
          "function = myFunction()",
          "create function myFunction()",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which of the following is used to declare a variable in JavaScript?",
        options: ["let", "var", "const", "all of the above"],
        correctAnswer: 3,
      },
      {
        questionText: "How do you add a comment in JavaScript?",
        options: [
          "// comment",
          "<!-- comment -->",
          "/* comment */",
          "all of the above",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What will `console.log(2 + '2')` output?",
        options: ["22", "4", "Error", "undefined"],
        correctAnswer: 0,
      },
    ],
  },
  // Node.js Fundamentals
  {
    title: "Node.js Fundamentals",
    questions: [
      {
        questionText: "Which module is used to create a web server in Node.js?",
        options: ["http", "express", "mongoose", "fs"],
        correctAnswer: 0,
      },
      {
        questionText: "What does 'npm' stand for?",
        options: [
          "Node Package Manager",
          "Node Programming Module",
          "Network Programming Module",
          "New Package Manager",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which method is used to read a file asynchronously in Node.js?",
        options: ["fs.readFile()", "fs.read()", "fs.open()", "fs.write()"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the default port number for an HTTP server in Node.js?",
        options: ["3000", "8080", "80", "443"],
        correctAnswer: 0,
      },
      {
        questionText: "Which package is commonly used for routing in Node.js?",
        options: ["express", "http", "url", "fs"],
        correctAnswer: 0,
      },
    ],
  },
  // MongoDB Basics
  {
    title: "MongoDB Basics",
    questions: [
      {
        questionText:
          "Which command is used to insert a document into a MongoDB collection?",
        options: [
          "db.collection.insertOne()",
          "db.collection.add()",
          "db.collection.save()",
          "db.collection.push()",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which method is used to retrieve documents from a MongoDB collection?",
        options: ["find()", "get()", "search()", "query()"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which operator is used to match any value in a MongoDB query?",
        options: ["$", "#", "*", "@"],
        correctAnswer: 0,
      },
      {
        questionText: "How do you update a document in MongoDB?",
        options: [
          "db.collection.update()",
          "db.collection.modify()",
          "db.collection.set()",
          "db.collection.replace()",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which command is used to create an index in MongoDB?",
        options: [
          "db.collection.createIndex()",
          "db.collection.addIndex()",
          "db.collection.index()",
          "db.collection.create()",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // React.js Essentials
  {
    title: "React.js Essentials",
    questions: [
      {
        questionText: "What is the main purpose of React?",
        options: [
          "To build user interfaces",
          "To create databases",
          "To manage HTTP requests",
          "To manage server-side rendering",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which of the following is a valid React component lifecycle method?",
        options: [
          "componentDidMount",
          "componentWillRender",
          "componentIsReady",
          "componentDidLoad",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is JSX?",
        options: [
          "JavaScript XML",
          "JavaScript eXtended",
          "JavaScript Extension",
          "JavaScript eXperience",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "How do you handle events in React?",
        options: [
          "Using event handlers",
          "Using onClick attributes",
          "Using state",
          "Using props",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the purpose of the `key` prop in React?",
        options: [
          "To identify elements uniquely",
          "To pass data between components",
          "To set component state",
          "To style components",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Python Basics
  {
    title: "Python Basics",
    questions: [
      {
        questionText: "What is the correct way to define a function in Python?",
        options: [
          "def my_function():",
          "function my_function():",
          "create function my_function():",
          "my_function():",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "How do you insert comments in Python?",
        options: [
          "# comment",
          "// comment",
          "/* comment */",
          "<!-- comment -->",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which keyword is used to create a class in Python?",
        options: ["class", "create", "define", "new"],
        correctAnswer: 0,
      },
      {
        questionText: "What will `print(type(3.14))` output?",
        options: [
          "<class 'float'>",
          "<class 'int'>",
          "<class 'str'>",
          "<class 'list'>",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "How do you list all attributes of an object in Python?",
        options: [
          "dir(object)",
          "list(object)",
          "attributes(object)",
          "get(object)",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // SQL Basics
  {
    title: "SQL Basics",
    questions: [
      {
        questionText: "What is the SQL command to retrieve data from a table?",
        options: ["SELECT", "GET", "FETCH", "RETRIEVE"],
        correctAnswer: 0,
      },
      {
        questionText: "How do you insert a new record into a table in SQL?",
        options: [
          "INSERT INTO table_name VALUES (values)",
          "ADD INTO table_name (values)",
          "UPDATE table_name SET values",
          "CREATE INTO table_name VALUES (values)",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which SQL clause is used to filter the results?",
        options: ["WHERE", "FILTER", "HAVING", "SELECT"],
        correctAnswer: 0,
      },
      {
        questionText: "How do you delete a record from a table in SQL?",
        options: [
          "DELETE FROM table_name WHERE condition",
          "REMOVE FROM table_name WHERE condition",
          "DROP FROM table_name WHERE condition",
          "ERASE FROM table_name WHERE condition",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which SQL statement is used to update data in a table?",
        options: [
          "UPDATE table_name SET column_name = value WHERE condition",
          "MODIFY table_name SET column_name = value WHERE condition",
          "ALTER table_name SET column_name = value WHERE condition",
          "CHANGE table_name SET column_name = value WHERE condition",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // HTML Basics
  {
    title: "HTML Basics",
    questions: [
      {
        questionText: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "Hyperlink and Text Markup Language",
          "HyperText Multi Language",
          "HyperText Machine Language",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which HTML tag is used to define an unordered list?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        correctAnswer: 0,
      },
      {
        questionText: "How do you add a comment in HTML?",
        options: [
          "<!-- comment -->",
          "// comment",
          "/* comment */",
          "<-- comment -->",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the correct HTML element for the largest heading?",
        options: ["<h1>", "<heading>", "<h6>", "<head>"],
        correctAnswer: 0,
      },
      {
        questionText: "How do you create a hyperlink in HTML?",
        options: [
          "<a href='url'>",
          "<link href='url'>",
          "<hyperlink url=''>",
          "<a url=''>",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // CSS Basics
  {
    title: "CSS Basics",
    questions: [
      {
        questionText: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Colorful Style Sheets",
          "Computer Style Sheets",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "How do you apply a CSS style to an HTML element?",
        options: [
          "Using the style attribute",
          "Using the <style> tag",
          "Using an external stylesheet",
          "All of the above",
        ],
        correctAnswer: 3,
      },
      {
        questionText:
          "Which property is used to change the background color in CSS?",
        options: ["background-color", "bgcolor", "color", "background"],
        correctAnswer: 0,
      },
      {
        questionText:
          "How do you select an element with the id 'header' in CSS?",
        options: ["#header", ".header", "header", "id:header"],
        correctAnswer: 0,
      },
      {
        questionText: "Which CSS property controls the text size?",
        options: ["font-size", "text-size", "font-style", "text-style"],
        correctAnswer: 0,
      },
    ],
  },
  // General Knowledge
  {
    title: "General Knowledge",
    questions: [
      {
        questionText: "What is the capital of France?",
        options: ["Paris", "Berlin", "Madrid", "Rome"],
        correctAnswer: 0,
      },
      {
        questionText: "Who wrote 'To Kill a Mockingbird'?",
        options: [
          "Harper Lee",
          "Mark Twain",
          "Ernest Hemingway",
          "F. Scott Fitzgerald",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which planet is known as the Red Planet?",
        options: ["Mars", "Jupiter", "Saturn", "Venus"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the largest ocean on Earth?",
        options: [
          "Pacific Ocean",
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Who painted the Mona Lisa?",
        options: [
          "Leonardo da Vinci",
          "Vincent van Gogh",
          "Claude Monet",
          "Pablo Picasso",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Geography
  {
    title: "Geography",
    questions: [
      {
        questionText: "Which is the largest continent by area?",
        options: ["Asia", "Africa", "Europe", "North America"],
        correctAnswer: 0,
      },
      {
        questionText: "Which river is the longest in the world?",
        options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the smallest country in the world?",
        options: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"],
        correctAnswer: 0,
      },
      {
        questionText: "Which mountain range separates Europe from Asia?",
        options: ["Ural Mountains", "Himalayas", "Andes", "Rockies"],
        correctAnswer: 0,
      },
      {
        questionText: "Which desert is the largest in the world?",
        options: ["Sahara", "Gobi", "Kalahari", "Mojave"],
        correctAnswer: 0,
      },
    ],
  },
  // History
  {
    title: "History",
    questions: [
      {
        questionText: "Who was the first President of the United States?",
        options: [
          "George Washington",
          "Thomas Jefferson",
          "Abraham Lincoln",
          "John Adams",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "In which year did the Titanic sink?",
        options: ["1912", "1905", "1915", "1920"],
        correctAnswer: 0,
      },
      {
        questionText: "Who was the first man to walk on the moon?",
        options: [
          "Neil Armstrong",
          "Buzz Aldrin",
          "Yuri Gagarin",
          "Michael Collins",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which empire was ruled by Julius Caesar?",
        options: [
          "Roman Empire",
          "Ottoman Empire",
          "Byzantine Empire",
          "Ming Dynasty",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What was the main cause of World War I?",
        options: [
          "Assassination of Archduke Franz Ferdinand",
          "Treaty of Versailles",
          "Economic Depression",
          "Colonial Rivalries",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Science
  {
    title: "Science",
    questions: [
      {
        questionText: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        correctAnswer: 0,
      },
      {
        questionText: "What planet is known for its rings?",
        options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the powerhouse of the cell?",
        options: [
          "Mitochondria",
          "Nucleus",
          "Ribosome",
          "Endoplasmic Reticulum",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the process by which plants make their food?",
        options: [
          "Photosynthesis",
          "Respiration",
          "Digestion",
          "Transpiration",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the most abundant gas in Earth's atmosphere?",
        options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
        correctAnswer: 0,
      },
    ],
  },
  // Technology
  {
    title: "Technology",
    questions: [
      {
        questionText: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "Hyperlink and Text Markup Language",
          "HyperText Multi Language",
          "HyperText Machine Language",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the primary purpose of a firewall?",
        options: [
          "To protect a network from unauthorized access",
          "To connect devices to the internet",
          "To store data",
          "To enhance processing speed",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which company developed the Android operating system?",
        options: ["Google", "Apple", "Microsoft", "IBM"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the name of the first computer virus?",
        options: ["Creeper", "ILOVEYOU", "Melissa", "MyDoom"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which programming language is known as the 'mother of all languages'?",
        options: ["C", "Java", "Python", "Fortran"],
        correctAnswer: 0,
      },
    ],
  },
  // Literature
  {
    title: "Literature",
    questions: [
      {
        questionText: "Who wrote 'Pride and Prejudice'?",
        options: [
          "Jane Austen",
          "Charlotte Brontë",
          "Emily Dickinson",
          "Mary Shelley",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which epic poem is attributed to Homer?",
        options: ["The Iliad", "The Odyssey", "The Aeneid", "Beowulf"],
        correctAnswer: 0,
      },
      {
        questionText: "Who is the author of '1984'?",
        options: [
          "George Orwell",
          "Aldous Huxley",
          "Ray Bradbury",
          "H.G. Wells",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "In which novel does the character Jay Gatsby appear?",
        options: [
          "The Great Gatsby",
          "To Kill a Mockingbird",
          "The Catcher in the Rye",
          "Moby Dick",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Who wrote 'The Catcher in the Rye'?",
        options: [
          "J.D. Salinger",
          "F. Scott Fitzgerald",
          "Ernest Hemingway",
          "John Steinbeck",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Mathematics
  {
    title: "Mathematics",
    questions: [
      {
        questionText: "What is the value of Pi (π) up to two decimal places?",
        options: ["3.14", "3.15", "3.16", "3.13"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the square root of 64?",
        options: ["8", "6", "7", "9"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the formula for the area of a circle?",
        options: ["πr^2", "2πr", "πd", "2πr^2"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the sum of the angles in a triangle?",
        options: ["180 degrees", "360 degrees", "90 degrees", "270 degrees"],
        correctAnswer: 0,
      },
      {
        questionText: "What is 5 factorial (5!)?",
        options: ["120", "60", "24", "10"],
        correctAnswer: 0,
      },
    ],
  },
  // Business
  {
    title: "Business",
    questions: [
      {
        questionText: "What does SWOT stand for in a SWOT analysis?",
        options: [
          "Strengths, Weaknesses, Opportunities, Threats",
          "Strengths, Weaknesses, Operations, Tactics",
          "Strategies, Weaknesses, Operations, Tactics",
          "Strengths, Weaknesses, Objectives, Targets",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which financial statement shows a company's assets, liabilities, and equity?",
        options: [
          "Balance Sheet",
          "Income Statement",
          "Cash Flow Statement",
          "Statement of Retained Earnings",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the primary goal of a marketing strategy?",
        options: [
          "To increase sales",
          "To reduce costs",
          "To enhance employee productivity",
          "To improve customer service",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is a market share?",
        options: [
          "The portion of a market controlled by a company",
          "The total revenue of a company",
          "The total number of customers",
          "The profit margin of a company",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the term for a company's ongoing expenses?",
        options: [
          "Operating Costs",
          "Fixed Costs",
          "Variable Costs",
          "Total Costs",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Art
  {
    title: "Art",
    questions: [
      {
        questionText: "Who painted the 'Starry Night'?",
        options: [
          "Vincent van Gogh",
          "Claude Monet",
          "Pablo Picasso",
          "Edvard Munch",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the primary medium used in watercolor painting?",
        options: ["Watercolor paint", "Oil paint", "Acrylic paint", "Charcoal"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which artist is known for the 'Campbell's Soup Cans' series?",
        options: [
          "Andy Warhol",
          "Jackson Pollock",
          "Salvador Dalí",
          "Henri Matisse",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "What technique involves creating a painting by applying paint in thick layers?",
        options: ["Impasto", "Sfumato", "Chiaroscuro", "Fresco"],
        correctAnswer: 0,
      },
      {
        questionText: "Which art movement is associated with Salvador Dalí?",
        options: ["Surrealism", "Impressionism", "Cubism", "Expressionism"],
        correctAnswer: 0,
      },
    ],
  },
  // Music
  {
    title: "Music",
    questions: [
      {
        questionText: "Who composed 'Symphony No. 5'?",
        options: [
          "Ludwig van Beethoven",
          "Wolfgang Amadeus Mozart",
          "Johann Sebastian Bach",
          "Franz Schubert",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the term for a piece of music written for a solo instrument with orchestral accompaniment?",
        options: ["Concerto", "Sonata", "Symphony", "Etude"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which genre of music is associated with Louis Armstrong?",
        options: ["Jazz", "Classical", "Rock", "Hip-Hop"],
        correctAnswer: 0,
      },
      {
        questionText: "Who is known as the 'King of Pop'?",
        options: ["Michael Jackson", "Elvis Presley", "Prince", "Madonna"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the term for a musical composition for a group of singers?",
        options: ["Choral", "Solo", "Duet", "Trio"],
        correctAnswer: 0,
      },
    ],
  },
  // Sports
  {
    title: "Sports",
    questions: [
      {
        questionText: "Which sport is known as the 'king of sports'?",
        options: ["Soccer", "Basketball", "Cricket", "Tennis"],
        correctAnswer: 0,
      },
      {
        questionText:
          "How many players are there in a standard basketball team?",
        options: ["5", "7", "9", "11"],
        correctAnswer: 0,
      },
      {
        questionText: "In which country did the Olympic Games originate?",
        options: ["Greece", "Italy", "France", "Egypt"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the length of a standard tennis court?",
        options: [
          "23.77 meters",
          "25.00 meters",
          "20.00 meters",
          "22.00 meters",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which country won the FIFA World Cup in 2018?",
        options: ["France", "Croatia", "Germany", "Brazil"],
        correctAnswer: 0,
      },
    ],
  },
  // Cooking
  {
    title: "Cooking",
    questions: [
      {
        questionText: "What is the main ingredient in guacamole?",
        options: ["Avocado", "Tomato", "Pepper", "Onion"],
        correctAnswer: 0,
      },
      {
        questionText: "Which type of pasta is shaped like a small shell?",
        options: ["Conchiglie", "Penna", "Fusilli", "Spaghetti"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the name of the Italian dish made of layers of pasta, cheese, and meat?",
        options: ["Lasagna", "Ravioli", "Gnocchi", "Fettuccine"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the technique of cooking food in a vacuum-sealed bag called?",
        options: ["Sous-vide", "Poaching", "Roasting", "Steaming"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the name of the French dish made of thinly sliced potatoes?",
        options: [
          "Gratin Dauphinois",
          "Ratatouille",
          "Bouillabaisse",
          "Quiche",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Travel
  {
    title: "Travel",
    questions: [
      {
        questionText: "What is the most visited city in the world?",
        options: ["Bangkok", "Paris", "New York", "Tokyo"],
        correctAnswer: 0,
      },
      {
        questionText: "Which country is known for its tulip fields?",
        options: ["Netherlands", "France", "Italy", "Spain"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the largest island in the world?",
        options: ["Greenland", "New Guinea", "Borneo", "Madagascar"],
        correctAnswer: 0,
      },
      {
        questionText: "Which city is famous for its canals?",
        options: ["Venice", "Amsterdam", "Copenhagen", "Lisbon"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the currency used in Japan?",
        options: ["Yen", "Won", "Dollar", "Euro"],
        correctAnswer: 0,
      },
    ],
  },
  // Health
  {
    title: "Health",
    questions: [
      {
        questionText: "What vitamin is primarily obtained from sunlight?",
        options: ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin B12"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the name of the condition characterized by high blood sugar levels?",
        options: ["Diabetes", "Hypertension", "Asthma", "Anemia"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which organ is responsible for pumping blood throughout the body?",
        options: ["Heart", "Liver", "Kidney", "Lung"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the recommended amount of sleep for adults?",
        options: ["7-9 hours", "5-7 hours", "9-11 hours", "6-8 hours"],
        correctAnswer: 0,
      },
      {
        questionText: "Which nutrient is essential for building muscle?",
        options: ["Protein", "Carbohydrate", "Fat", "Vitamins"],
        correctAnswer: 0,
      },
    ],
  },
  // Movies
  {
    title: "Movies",
    questions: [
      {
        questionText: "Who directed 'The Godfather'?",
        options: [
          "Francis Ford Coppola",
          "Martin Scorsese",
          "Steven Spielberg",
          "Quentin Tarantino",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "Which movie features the character 'Forrest Gump'?",
        options: [
          "Forrest Gump",
          "The Shawshank Redemption",
          "Pulp Fiction",
          "The Godfather",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the name of the fictional African country in 'Black Panther'?",
        options: ["Wakanda", "Zamunda", "Elbonia", "Genosha"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which film won the Academy Award for Best Picture in 2020?",
        options: ["Parasite", "1917", "Once Upon a Time in Hollywood", "Joker"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Who played the character 'Jack Sparrow' in 'Pirates of the Caribbean'?",
        options: [
          "Johnny Depp",
          "Orlando Bloom",
          "Brad Pitt",
          "Leonardo DiCaprio",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Astronomy
  {
    title: "Astronomy",
    questions: [
      {
        questionText: "What is the closest star to Earth?",
        options: ["The Sun", "Proxima Centauri", "Alpha Centauri", "Sirius"],
        correctAnswer: 0,
      },
      {
        questionText: "Which planet is known as the 'Giant Red Spot'?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Neptune", "Earth"],
        correctAnswer: 0,
      },
      {
        questionText: "Which planet has the most moons?",
        options: ["Saturn", "Jupiter", "Mars", "Uranus"],
        correctAnswer: 0,
      },
      {
        questionText: "What is the name of the galaxy we live in?",
        options: ["Milky Way", "Andromeda", "Triangulum", "Whirlpool"],
        correctAnswer: 0,
      },
    ],
  },
  // Programming Languages
  {
    title: "Programming Languages",
    questions: [
      {
        questionText:
          "Which programming language is known for its use in web development?",
        options: ["JavaScript", "C#", "Swift", "Rust"],
        correctAnswer: 0,
      },
      {
        questionText: "What is Python commonly used for?",
        options: [
          "Data Science",
          "Video Editing",
          "3D Modeling",
          "Database Management",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which language is known for its use in iOS app development?",
        options: ["Swift", "Kotlin", "Java", "Ruby"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which programming language is known for its speed and efficiency?",
        options: ["C++", "Java", "Python", "JavaScript"],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which language is commonly used for server-side development?",
        options: ["Node.js", "PHP", "Ruby", "HTML"],
        correctAnswer: 1,
      },
    ],
  },
  // Finance
  {
    title: "Finance",
    questions: [
      {
        questionText: "What does ROI stand for?",
        options: [
          "Return on Investment",
          "Rate of Interest",
          "Return on Income",
          "Ratio of Investment",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which financial instrument represents ownership in a company?",
        options: ["Stock", "Bond", "Option", "Futures"],
        correctAnswer: 0,
      },
      {
        questionText:
          "What is the term for a market condition where prices are rising?",
        options: [
          "Bull Market",
          "Bear Market",
          "Stagnant Market",
          "Volatile Market",
        ],
        correctAnswer: 0,
      },
      {
        questionText: "What is the primary purpose of a budget?",
        options: [
          "Track Expenses",
          "Invest Money",
          "Generate Revenue",
          "Predict Market Trends",
        ],
        correctAnswer: 0,
      },
      {
        questionText:
          "Which term refers to the total value of goods and services produced within a country?",
        options: [
          "Gross Domestic Product",
          "Net Income",
          "Market Cap",
          "Revenue",
        ],
        correctAnswer: 0,
      },
    ],
  },
];

async function quizSeeder() {
  try {
    // Clear existing quizzes
    await Quiz.deleteMany({});
    logger.info("Existing quizzes cleared.");

    // Fetch all groups with their owners
    const groups = await Group.find({}).populate("owner");

    if (groups.length === 0) {
      logger.warn("No groups found to assign quizzes to.");
      return;
    }

    for (const quiz of quizData) {
      // Randomly select a group and assign its owner as the quiz creator
      const randomGroup = groups[Math.floor(Math.random() * groups.length)];
      quiz.group = randomGroup._id;
      quiz.createdBy = randomGroup.owner._id;

      // Create the quiz
      const newQuiz = await Quiz.create(quiz);
      logger.info(
        `Quiz "${quiz.title}" added, created by ${randomGroup.owner.username}.`
      );

      // Update the group's quizzes array with the newly created quiz
      await Group.findByIdAndUpdate(randomGroup._id, {
        $push: { quizzes: newQuiz._id },
      });
      logger.info(`Group "${randomGroup._id}" updated with new quiz.`);
    }

    logger.info("Quiz data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding quiz data:", error);
  }
}

module.exports = quizSeeder;
