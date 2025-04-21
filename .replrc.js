var path = require('path');

var {parseProtostonesFromBlock} = require('./lib/block');
var protostones = parseProtostonesFromBlock(JSON.parse(require('fs').readFileSync(path.join(process.env.HOME, '893303.json'), 'utf8')).result);
