import { loader } from "@monaco-editor/react";

export function loadTheme() {
	return new Promise<void>((res) => {
		Promise.all([
			loader.init(),
			import("monaco-themes/themes/Twilight.json"),
		]).then(([monaco, themeData]) => {
			monaco.editor.defineTheme("twilight", themeData);
			res();
		});
	});
}
