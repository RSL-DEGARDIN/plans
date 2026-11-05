import fs from 'fs';
import JO from 'javascript-obfuscator';
const [,, inp, outp] = process.argv;
let html = fs.readFileSync(inp, 'utf8');
// repère l'unique <script> interne (sans src)
const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/);
if(!m){ console.error('script interne introuvable'); process.exit(1); }
const code = m[1];
const res = JO.obfuscate(code, {
  compact: true,
  target: 'browser',
  renameGlobals: false,            // garde les noms globaux (références croisées, pas de casse)
  identifierNamesGenerator: 'mangled',
  transformObjectKeys: false,      // garde les clés d'objet (state.deck, b.lvlDeck, format .rsl…)
  stringArray: true,
  stringArrayThreshold: 1,
  stringArrayEncoding: ['base64'],
  splitStrings: false,
  controlFlowFlattening: false,    // évite bugs et lenteur
  deadCodeInjection: false,
  numbersToExpressions: false,
  simplify: true,
  selfDefending: false,
  debugProtection: false,
  unicodeEscapeSequence: false,
}).getObfuscatedCode();
const out = html.replace(m[0], '<script>\n'+res+'\n</script>');
fs.writeFileSync(outp, out);
console.log('entrée JS:', code.length, 'octets -> obfusqué:', res.length, 'octets');
console.log('HTML total:', out.length, 'octets');
