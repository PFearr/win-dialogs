# win-dialogs

![NPM Downloads](https://img.shields.io/npm/dw/win-dialogs)
[![npm](https://img.shields.io/npm/v/win-dialogs.svg)](https://www.npmjs.com/package/win-dialogs)
[![license](https://img.shields.io/npm/l/win-dialogs.svg)](https://github.com/PFearr/win-dialogs/blob/main/LICENSE)
![npm bundle size](https://img.shields.io/bundlephobia/min/win-dialogs)
![NPM Downloads by package author](https://img.shields.io/npm-stat/dy/pfearr)



**File dialogs for Node.js.**  
Uses PowerShell and .NET WinForms to open native Windows file/folder dialogs with support for Folder Picking and File Picking and customizable options.



## ❗ Notes

* This module only works on **Windows**.
* Requires access to PowerShell + .NET Forms.
* Dialogs are asynchronous

---

## 📦 Installation

```bash
npm install win-dialogs
````

> Requires Windows with PowerShell and .NET Framework installed (available on all Windows 7+ systems).

---

## 🧠 Features

* Native Windows File & Folder dialogs
* Supports:

  * FolderBrowserDialog (single)
  * OpenFileDialog (single or multiple)
  * OpenFolderDialog (single or multiple)
* Customizable dialog parameters (title, filters, default name, etc)
* Compatible with both **CommonJS** and **ES Modules**

---

## 🚀 Simple Usage

### ES Modules

```js
import { OpenFolderDialog } from 'win-dialogs';

const folder = await OpenFolderDialog('Choose a folder', 'SelectHere');
console.log('Selected folder:', folder);
```

### CommonJS

```js
const { OpenFileDialog } = require('win-dialogs');

OpenFileDialog('Pick a file', 'All Files (*.*)|*.*')
  .then(console.log)
  .catch(console.error);
```

---

## 📘 Functions

### `FolderBrowserDialog(description?, rootFolder?, etcParams?)`

Opens a classic folder picker dialog.

| Param         | Type     | Default         | Description                        |
| ------------- | -------- | --------------- | ---------------------------------- |
| `description` | `string` | "Select Folder" | Text to display inside the dialog  |
| `rootFolder`  | `string` | "Desktop"       | Special folder name or full path   |
| `etcParams`   | `object` | `{}`            | Additional WinForms dialog options |

---

### `OpenFileDialog(title?, filter?, multiSelect?, initialDir?, etcParams?)`

Opens a file dialog.

| Param         | Type            | Default            |        |
| ------------- | --------------- | ------------------ | ------ |
| `title`       | `string`        | "Select File"      |        |
| `filter`      | `string`        | "All Files (\*.\*) | \*.\*" |
| `multiSelect` | `boolean`       | `false`            |        |
| `initialDir`  | `string`        | "Desktop"          |        |
| `etcParams`   | `DialogOptions` | `{}`               |        |

---

### `OpenFolderDialog(title?, initialName?, initialDir?, multiSelect?, etcParams?)`

Opens a folder dialog.

| Param         | Type            | Default           |
| ------------- | --------------- | ----------------- |
| `title`       | `string`        | "Select Folder"   |
| `initialName` | `string`        | "Select a Folder" |
| `initialDir`  | `string`        | "Desktop"         |
| `multiSelect` | `boolean`       | `false`           |
| `etcParams`   | `DialogOptions` | `{}`              |

---

## 🛠 Some `etcParams` Options

| Option                         | Type      | Description                                                 |
| ------------------------------ | --------- | ----------------------------------------------------------- |
| `ValidateNames`                | `boolean` | Allow/disallow invalid filenames                            |
| `CheckFileExists`              | `boolean` | Require existing files                                      |
| `CheckPathExists`              | `boolean` | Require existing paths                                      |
| `RestoreDirectory`             | `boolean` | Resets directory after use                                  |
| `DefaultExt`                   | `string`  | Default file extension (e.g. `"txt"`)                       |
| `AddExtension`                 | `boolean` | Automatically append extension                              |
| `SupportMultiDottedExtensions` | `boolean` | Support `.tar.gz`, `.config.js`, etc.                       |

---

## 💡 OpenFolderDialog Example

```js
const selected = await OpenFolderDialog('Choose Folder', 'Select a folder now', 'Desktop', false, {
	CheckPathExists: true,
	ValidateNames: false,
});

console.log('You picked:', selected);
```

## 💡 FolderBrowserDialog Example

```js
const selected = await FolderBrowserDialog('Select Folder', 'C:\\', {});

console.log('You picked:', selected);
```

## 💡 OpenFileDialog Example

```js
const selected = await OpenFileDialog('Select Folder', 'Office Files|*.doc;*.xls;*.ppt' 'C:\\', {});

console.log('You picked:', selected);
```


---

## 🧩 TypeScript Support

```ts
import { OpenFolderDialog, DialogOptions } from 'win-dialogs';

const options: DialogOptions = {
	CheckPathExists: true
};

const folder = await OpenFolderDialog('Choose', 'Choose a folder', 'Desktop', false, options);
```


