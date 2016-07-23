var babel = require("babel-core");

var code = "var asd=70; var foo = ()=>{ console.log('HOLA MUNDO',asd); foo();}";

var result = babel.transform(code, {
    presets: ["es2015"],
    minified:true,
    comments:false
});

console.log(result.code);