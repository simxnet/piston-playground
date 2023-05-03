export const MONACO_OPTIONS = {
	fontFamily:
		'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
	fontSize: 14,
	lineHeight: 21,
	minimap: { enabled: false },

	wordWrap: "on",
	wordWrapColumn: 40,
	wrappingIndent: "indent",
	glyphMargin: true,
	lineNumbersMinChars: 2,
	folding: false,
	fixedOverflowWidgets: true,
	scrollbar: {
		horizontalScrollbarSize: 21,
	},

	quickSuggestions: {
		strings: true,
	},
};

export const endpoints = {
	runtimes: "https://emkc.org/api/v2/piston/runtimes",
	execute: "https://emkc.org/api/v2/piston/execute",
};

export const defaultMessageString =
	"LyoqCiAqIFdlbGNvbWUgdG8gdGhlIFBpc3RvbiBQbGF5Z3JvdW5kIQogKiBHZXQgc3RhcnRlZCB3cml0aW5nIHNvbWUgY29kZSBvbiB0aGlzIGVkaXRvciwgc2VsZWN0IHlvdXIgcHJlZmVycmVkIGxhbmd1YWdlIGFuZCBwcmVzcyAiUnVuIiBidXR0b24hCiAqIAogKiBSdWxlczoKICogMS4gRG8gbm90IGFidXNlIG9mIFBpc3RvbiBhcGkgKGUuZzogbWFraW5nIHVubmVjZXNhcnkgcmVxdWVzdCBvciBmbG9vZGluZyB0aGUgYXBpIHdpdGggcmVxdWVzdHMpCiAqIDIuIERvIG5vdCBleGVjdXRlIG1hbGljaW91cyBjb2RlIQogKiAzLiBMZWF2ZSBhIHN0YXIgb24gW291ciByZXBvXShodHRwczovL2dpdGh1Yi5jb20vYnJ4ZW0vcGlzdG9uLXVpLXJlYWN0KQogKiAKICogQGF1dGhvciBCcnhlbQogKi8KCmZ1bmN0aW9uIGhlbGxvKG5hbWU6IHN0cmluZykgewogICAgY29uc29sZS5sb2coYEhlbGxvICR7bmFtZX1gKQp9CgpoZWxsbygid29ybGQiKQ==";

export const defaultMessage = Buffer.from(
	defaultMessageString,
	"base64",
).toString("utf-8");
