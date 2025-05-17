/// <reference types="node" />

/**
 * Common parameters that can be passed to OpenFileDialog/OpenFolderDialog
 * These correspond to properties of the .NET System.Windows.Forms.OpenFileDialog or FolderBrowserDialog
 */
export interface DialogOptions {
	/**
	 * Whether the dialog should allow selecting folders with invalid names
	 */
	ValidateNames?: boolean;

	/**
	 * Whether the dialog should check if the file exists
	 */
	CheckFileExists?: boolean;

	/**
	 * Whether the dialog should check if the path exists
	 */
	CheckPathExists?: boolean;


	/**
	 * Custom additional dialog params (key-value string pairs)
	 */
	[key: string]: string | boolean | number | undefined;
}

/**
 * Opens a classic FolderBrowserDialog for selecting a folder.
 * @param description Text displayed in the dialog.
 * @param rootFolder Starting folder (e.g., 'Desktop', 'MyComputer', 'MyDocuments').
 * @param etcParams Additional .NET dialog properties.
 * @returns The selected folder path.
 */
export function FolderBrowserDialog(
	description?: string,
	rootFolder?: string,
	etcParams?: DialogOptions
): Promise<string>;

/**
 * Opens a modern OpenFileDialog for selecting a file (can also be adapted for folder).
 * @param title Dialog window title.
 * @param filter Filter string, like "Text Files (*.txt)|*.txt|All Files (*.*)|*.*"
 * @param multiSelect Whether multiple file/folder selection is allowed.
 * @param initialDir The starting folder or special name like 'Desktop'.
 * @param etcParams Additional .NET dialog properties.
 * @returns The selected file or folder path.
 */
export function OpenFileDialog(
	title?: string,
	filter?: string,
	multiSelect?: boolean,
	initialDir?: string,
	etcParams?: DialogOptions
): Promise<string>;

/**
 * Opens a folder selection dialog using OpenFileDialog with tricks.
 * @param title Dialog title.
 * @param initialName A placeholder filename (used to represent folder selection).
 * @param initialDir Starting folder.
 * @param multiSelect Whether multiple folders can be selected.
 * @param etcParams Additional .NET dialog properties.
 * @returns The selected folder path or multiple paths joined by newline.
 */
export function OpenFolderDialog(
	title?: string,
	initialName?: string,
	initialDir?: string,
	multiSelect?: boolean,
	etcParams?: DialogOptions
): Promise<string>;
