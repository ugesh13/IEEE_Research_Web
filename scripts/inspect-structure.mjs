import fs from 'fs';
const content = fs.readFileSync('paper/Student_performance_perdiction_IEEE_Final.md', 'utf8');

// Let's see how content is structured
console.log('Total length:', content.length);

