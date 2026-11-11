import fs from 'fs';
const content = fs.readFileSync('paper/Student_performance_perdiction_IEEE_Final.md', 'utf8');

function findSnippet(phrase) {
  const idx = content.indexOf(phrase);
  if (idx !== -1) {
    console.log(`Found "${phrase}":\n`, JSON.stringify(content.substring(idx, idx + phrase.length + 120)));
  } else {
    // try lowercase search
    const lIdx = content.toLowerCase().indexOf(phrase.toLowerCase());
    if (lIdx !== -1) {
      console.log(`Found (case-insensitive) "${phrase}":\n`, JSON.stringify(content.substring(lIdx, lIdx + phrase.length + 120)));
    } else {
      console.log(`NOT found: "${phrase}"`);
    }
  }
}

findSnippet('Algorithmic bias');
findSnippet('slicing analysis');
findSnippet('is_at_risk');
findSnippet('Table II');
findSnippet('wherex');
findSnippet('evaluated on the');
findSnippet('wherep');
findSnippet('A dash indi');
findSnippet('Several limitations');

