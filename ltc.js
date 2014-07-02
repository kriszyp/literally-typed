var htmlparser = require('htmlparser2');
var child_process = require('child_process');
var qfs = require('q-io/fs');
var all = require('promised-io/promise').all;
function parseHTML(html) {
	var outputFiles = [];
	var tags = {
		interface: function (content) {
			tsOutput.push('interface ');
			tsOutput.push(content);
			tsOutput.push('{\n');
		},
		module: function (content) {
			writeCurrentFile();
			// TODO: relativize
			dtsFile = content.replace(/\.js^/, '') + '.d.ts';
		},
		function: function (content) {
			tsOutput.push(content + ';');
		}
	};
	var handler = new htmlparser.DomHandler(function (error, dom) {
	    if (error) {
	        console.error('Parsing error', error);
	    }
	    else {
	        visitDom(dom);
	        writeCurrentFile();
	    }
	});
	var parser = new htmlparser.Parser(handler);
	var dtsFile;
	var writes = [];
	var tsOutput = [];
	var stack = [];
	var currentDepth = 0;
	parser.write(html);
	parser.done();	// this will hold the TypeScript output
	function writeCurrentFile() {
		if (dtsFile) {
			outputFiles.push(dtsFile);
			writes.push(qfs.write(dtsFile, tsOutput.join('')));
		}
		dtsFile = null;
	}
	function visitDom(nodes) {
		// scan the dom for TypeScript elements
		for (var i = 0, l = nodes.length; i < l; i++) {
			var node = nodes[i];
			if (node.type === 'tag'){
				// determine hierarchy
				var tagName = node.name.toLowerCase();
				var content = node.children[0].data;
				var tagHandler = tags[tagName] || tags['x-' + tagName] || tags['ts-' + tagName];
				if (tagHandler) {
					tagHandler(content);
				} else {
					//visitDom(node.children);
				}
			}
		}
	}
	// combine the cumulative output into a string
	return all(writes).then(function(){
		return outputFiles;
	});
}

function processDirectory(directory) {
	qfs.listTree(directory, function (path, stat) {
		return !!path.match(/\.md/);
	}).then(function (files) {
		var outputFiles = [];
		return all(files.map(function (file) {
			return qfs.read(file).then(function(contents){
				return parseHTML(contents);
			}).then(function(outputFilesForContents){
				outputFiles.push.apply(outputFiles, outputFilesForContents);
			});
		})).then(function(){
			return outputFiles;
		})
	}).then(function(outputFiles){
		// TODO: need to wait for all the files to be written
		process.mainModule = {
			filename: require.resolve('typescript/bin/tsc.js')
		};
		process.argv =  ['node', 'tsc'].concat(outputFiles);
		require('typescript/bin/tsc');
		return;
		var tsc = child_process.fork('node_modules/typescript/bin/tsc', {
			env: process.env
		}, outputFiles);
		tsc.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});

		tsc.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});

		tsc.on('close', function (code) {
			console.log('child process exited with code ' + code);
		});
		tsc.on('error', function (error) {
			console.log('child error ', error);
		});
	})
}

processDirectory('.');