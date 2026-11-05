import fs from 'fs';
import JO from 'javascript-obfuscator';
import { minify } from 'html-minifier-terser';
const [,, inp, outp] = process.argv;
let html = fs.readFileSync(inp, 'utf8');
// 1) obfusque l'unique <script> interne (sans src)
const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/);
if(!m){ console.error('script interne introuvable'); process.exit(1); }
const obf = JO.obfuscate(m[1], {
  compact:true, target:'browser', renameGlobals:false, identifierNamesGenerator:'mangled',
  transformObjectKeys:false, stringArray:true, stringArrayThreshold:1, stringArrayEncoding:['base64'],
  splitStrings:false, controlFlowFlattening:false, deadCodeInjection:false, numbersToExpressions:false,
  simplify:true, selfDefending:false, debugProtection:false, unicodeEscapeSequence:false,
}).getObfuscatedCode();
html = html.replace(m[0], '<script>\n'+obf+'\n</script>');
// 2) compacte le HTML + CSS (sans retoucher le JS déjà obfusqué)
const out = await minify(html, {
  collapseWhitespace:true, removeComments:true, minifyCSS:true, minifyJS:false,
  caseSensitive:true, keepClosingSlash:true, html5:true,
  removeRedundantAttributes:false, collapseBooleanAttributes:false, removeAttributeQuotes:false,
});
fs.writeFileSync(outp, out);
console.log('sortie:', out.length, 'octets');
