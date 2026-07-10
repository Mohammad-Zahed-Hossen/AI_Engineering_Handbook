import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function scanForDoubleEscapedNewlines(dir: string): { file: string; field: string; value: string }[] {
  const results: { file: string; field: string; value: string }[] = [];
  
  function scanFile(filePath: string, relativePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    function scanObject(obj: any, prefix: string = '') {
      for (const key in obj) {
        const value = obj[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          // Check for literal \n (backslash followed by n) that's not part of a LaTeX command
          // We look for patterns like \\n or \n that appear to be line breaks
          if (value.includes('\\n')) {
            // Check if this looks like a double-escaped newline issue
            // (i.e., literal backslash-n text where a real newline should be)
            const lines = value.split('\\n');
            if (lines.length > 1) {
              // This looks like it might be using \n as a line break substitute
              results.push({
                file: relativePath,
                field: fieldPath,
                value: value.substring(0, 100) + (value.length > 100 ? '...' : '')
              });
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          scanObject(value, fieldPath);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              scanObject(item, `${fieldPath}[${index}]`);
            } else if (typeof item === 'string') {
              if (item.includes('\\n')) {
                const lines = item.split('\\n');
                if (lines.length > 1) {
                  results.push({
                    file: relativePath,
                    field: `${fieldPath}[${index}]`,
                    value: item.substring(0, 100) + (item.length > 100 ? '...' : '')
                  });
                }
              }
            }
          });
        }
      }
    }
    
    scanObject(json);
  }
  
  function scanDirectory(dirPath: string, relativePath: string = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const entryRelativePath = relativePath ? path.join(relativePath, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, entryRelativePath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        scanFile(fullPath, entryRelativePath);
      }
    }
  }
  
  scanDirectory(dir);
  
  return results;
}

console.log('🔍 Scanning for double-escaped newlines (literal \\n) in data files...');
const results = scanForDoubleEscapedNewlines(DATA_DIR);

if (results.length === 0) {
  console.log('✅ No double-escaped newlines found.');
} else {
  console.log(`\n⚠️  Found ${results.length} occurrences of potential double-escaped newlines:\n`);
  results.forEach((result, index) => {
    console.log(`${index + 1}. File: ${result.file}`);
    console.log(`   Field: ${result.field}`);
    console.log(`   Value: ${result.value}`);
    console.log('');
  });
  
  console.log('⚠️  These appear to use literal \\n text where real newlines were intended.');
  console.log('⚠️  This breaks markdown/LaTeX rendering that expects actual newline characters.');
  console.log('⚠️  Please review manually before applying fixes.');
}

process.exit(results.length > 0 ? 1 : 0);
