#img-compare

Image comparisons without any other system dependencies.

If you're just comparing PNG's, use [node-resemble.js](https://github.com/lksv/node-resemble.js) instead. It's a *lot* faster.

```js
var comp = require("img-compare");

var config = {
    output: "diff.png",
    threshold: 50, // num of pixels allowed to differ    
};

comp(["test/01.png", "test/02.png"], config, function (err, out) {
    if (err) {
        console.log(err.message);
    }
    
    console.log(out); // out.status = fail/success.
                      // out.report = numpix: 1000, outfile: "diff.png"
});
```

**NOTE**: Works currently only on Mac OSX, Windows support coming soon
