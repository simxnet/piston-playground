import monaco from "monaco-editor";

export const endpoints = {
	runtimes: "https://emkc.org/api/v2/piston/runtimes",
	execute: "https://emkc.org/api/v2/piston/execute",
};

export const MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
	{
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
