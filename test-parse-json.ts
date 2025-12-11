import fs from 'fs';
import path from 'path';

const rawResponse = fs.readFileSync(
  path.join(process.cwd(), 'extractions', 'raw-response.txt'),
  'utf-8'
);

console.log('Raw response length:', rawResponse.length);
console.log('First 100 chars:', rawResponse.substring(0, 100));

// Remove markdown code blocks
let jsonText = rawResponse.trim();
if (jsonText.startsWith('```')) {
  jsonText = jsonText.replace(/^```(json)?\s*\n?/, '');
  jsonText = jsonText.replace(/\n?```\s*$/, '');
}

console.log('\nAfter removing code blocks:');
console.log('First 100 chars:', jsonText.substring(0, 100));
console.log('Last 100 chars:', jsonText.substring(jsonText.length - 100));

try {
  const result = JSON.parse(jsonText);
  console.log('\n✅ JSON parsed successfully!');
  console.log('Questions count:', result.questions.length);
  console.log('First question order:', result.questions[0].order);
  console.log('First question title:', result.questions[0].title.substring(0, 80));

  // Save cleaned JSON
  fs.writeFileSync(
    path.join(process.cwd(), 'extractions', 'exam-questions-long.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  );
  console.log('\n💾 Saved to: extractions/exam-questions-long.json');
} catch (error) {
  console.error('\n❌ Failed to parse:', error);
}
