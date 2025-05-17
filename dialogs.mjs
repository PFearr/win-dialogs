import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * @typedef {Object} DialogOptions
 * @property {boolean} [ValidateNames] - Whether invalid file names are allowed
 * @property {boolean} [CheckFileExists] - Whether the selected file must exist
 * @property {boolean} [CheckPathExists] - Whether the selected path must exist
 * @property {string} [Title] - Title of the dialog window
 * @property {string} [Filter] - File type filter string
 * @property {string} [InitialDirectory] - Starting folder
 * @property {boolean} [Multiselect] - Whether the dialog allows multiple selections
 * @property {any} [key] - Allow any additional .NET properties
 */

function psEscape(...args) {
	return args.map((value) => {
		if (typeof value === 'string') {
			// Removes any quotes that are not escaped bla bla bal
			// example:
			/*
			"test" -> test
			\"test" -> \"test\"
			"test\" -> test\"
			"test\"test" -> test\"test

			*/
			value = value.replace(/(^|[^\\])"/g, '$1');
			return value

		}

		if (Array.isArray(value)) {
			return value.map((item) => psEscape(item))
		}

		if (value === null || value === undefined) return '';
		return String(value);
	});
}





function buildParams(params = {}) {
	return Object.entries(params)
		.map(([key, value]) => `$dlg.${key} = "${value}"`)
		.join('\n');
}

function wrapScript(script) {
	return new Promise((resolve, reject) => {
		const child = spawn('powershell.exe', ['-NoProfile', '-Command', script]);

		let stdout = '';

		let stderr = '';

		child.stdout.on('data', (data) => (stdout += data));

		child.stderr.on('data', (data) => (stderr += data));

		child.on('close', (code) => {
			if (code === 0 && stdout.trim()) {
				resolve(stdout.trim());
			} else {
				reject(stderr || 'Dialog cancelled or failed.');
			}
		});

	});
}



/**
 * Opens a native folder browser dialog.
 * @param {string} [description="Select Folder"] - The dialog description.
 * @param {string} [rootFolder="Desktop"] - The initial folder (like 'Desktop').
 * @param {DialogOptions} [etcParams={}] - Extra properties for the dialog.
 * @returns {Promise<string>} Resolves with the selected folder path.
 */
export function FolderBrowserDialog(description = 'Select Folder', rootFolder = 'Desktop', etcParams = {}) {
	const extras = Object.entries(etcParams)
		.map(([key, value]) => `$objForm.${key} = "${value}"`)
		.join('\n');

	description, rootFolder = psEscape(description, rootFolder);
	etcParams = psEscape(etcParams);

	const script = `
Add-Type -AssemblyName System.Windows.Forms
Function Select-FolderDialog {
	param([string]$Description="${description}", [string]$RootFolder="${rootFolder}")
	$objForm = New-Object System.Windows.Forms.FolderBrowserDialog
	$objForm.Description = $Description
	$objForm.RootFolder = $RootFolder
${extras}
	$result = $objForm.ShowDialog()
	if ($result -eq "OK") { $objForm.SelectedPath } else { exit 1 }
}
Select-FolderDialog
`;
	return wrapScript(script);
}

/**
 * Opens a file dialog (or folder selector with tricks).
 * @param {string} [title="Select File"] - Dialog title.
 * @param {string} [filter="All Files (*.*)|*.*"] - File filter.
 * @param {boolean} [multiSelect=false] - Allow multiple selection.
 * @param {string} [initialDir="Desktop"] - Initial folder.
 * @param {DialogOptions} [etcParams={}] - Extra dialog options.
 * @returns {Promise<string>} Resolves with the selected file/folder path.
 */
export function OpenFileDialog(
	title = 'Select File',
	filter = 'All Files (*.*)|*.*',
	multiSelect = false,
	initialDir = 'Desktop',
	etcParams = {}
) {
	title, filter, initialDir = psEscape(title, filter, initialDir);
	etcParams = psEscape(etcParams);

	const isPath = /^[a-zA-Z]:\\/.test(initialDir);
	const extras = buildParams(etcParams);

	const script = `
Add-Type -AssemblyName System.Windows.Forms
$dlg = New-Object System.Windows.Forms.OpenFileDialog
$dlg.Title = "${title}"
$dlg.Filter = "${filter}"
$dlg.InitialDirectory = ${isPath ? `"${initialDir}"` : `[Environment]::GetFolderPath("${initialDir}")`}
$dlg.Multiselect = ${multiSelect}
${extras}
if ($dlg.ShowDialog() -eq "OK") {
	[System.IO.Path]::GetDirectoryName($dlg.FileName)
} else {
	exit 1
}
`;

	return wrapScript(script);
}


/**
 * Opens a modern folder dialog using OpenFileDialog.
 * @param {string} [title="Select Folder"] - Dialog title.
 * @param {string} [initialName="Select a Folder"] - Fake filename for folder picker.
 * @param {string} [initialDir="Desktop"] - Initial folder.
 * @param {boolean} [multiSelect=false] - Allow selecting multiple folders.
 * @param {DialogOptions} [etcParams={}] - Extra dialog options.
 * @returns {Promise<string>} Resolves with the folder path (or paths as string if multiSelect).
 */
export function OpenFolderDialog(
	title = 'Select Folder',
	initialName = 'Select a Folder',
	initialDir = 'Desktop',
	multiSelect = false,
	etcParams = {}
) {
	title,initialName, initialDir = psEscape(title, initialName, initialDir);
	etcParams = psEscape(etcParams);

	console.log('initialName', initialName);

	const isPath = /^[a-zA-Z]:\\/.test(initialDir);
	const extras = buildParams(etcParams);
	const script = `
Add-Type -AssemblyName System.Windows.Forms
$dlg = New-Object System.Windows.Forms.OpenFileDialog
$dlg.Title = "${title}"
$dlg.InitialDirectory = ${isPath ? `"${initialDir}"` : `[Environment]::GetFolderPath("${initialDir}")`}
$dlg.ValidateNames = $false
$dlg.CheckFileExists = $false
$dlg.CheckPathExists = $true
$dlg.FileName = "${initialName}"
$dlg.Multiselect = $${multiSelect == true ? 'true' : 'false'}
${extras}
if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
	if ($dlg.Multiselect) {
		$dlg.FileNames | ForEach-Object { [System.IO.Path]::GetDirectoryName($_) }
	} else {
		[System.IO.Path]::GetDirectoryName($dlg.FileName)
	}
} else {
	exit 1
}
`;

	return wrapScript(script);
}

// ESM Compatibility: run if directly called via node
if (import.meta.url === `file://${process.argv[1]}`) {
	OpenFileDialog('Pick a folder', 'Folders|*.folder', false, 'Desktop', {
		ValidateNames: false,
		CheckFileExists: false,
		CheckPathExists: true,
		FileName: 'Select Folder'
	})
		.then(console.log)
		.catch(console.error);
}

// CommonJS compatibility wrapper
try {
	if (typeof module !== 'undefined' && typeof require !== 'undefined') {
		module.exports = {
			FolderBrowserDialog,
			OpenFileDialog,
			OpenFolderDialog
		};
	}
} catch {}
