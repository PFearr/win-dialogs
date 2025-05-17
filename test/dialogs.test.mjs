// test/dialogs.esm.test.js
import assert from 'assert';
import { describe, it } from 'node:test';
import { FolderBrowserDialog, OpenFileDialog, OpenFolderDialog } from '../../dialogs.mjs';


describe('Windows Dialog Tests', () => {
  it('FolderBrowserDialog should return a selected folder path', async () => {
    console.log("🧪 Please select a folder in the FolderBrowserDialog");
    const result = await FolderBrowserDialog("Choose a folder", "Desktop");
    assert.ok(result && typeof result === 'string', 'Expected a valid folder path');
    console.log("✅ Selected folder:", result);
  });

  it('OpenFileDialog should return a file path', async () => {
    console.log("🧪 Please select a folder via OpenFileDialog");
    const result = await OpenFileDialog("Pick a folder (simulate file dialog)", "All Files|*.*", false, "Desktop", {
      ValidateNames: false,
      CheckFileExists: false,
      CheckPathExists: true,
      FileName: "Select Folder"
    });
    assert.ok(result && typeof result === 'string', 'Expected a folder path from OpenFileDialog');
    console.log("✅ Folder selected via OpenFileDialog:", result);
  });


  it('OpenFolderDialog should return multiple folder paths when multiselect is true', async () => {
    console.log("🧪 Please select MULTIPLE folders (Ctrl+Click) in OpenFolderDialog");
    const result = await OpenFolderDialog("Choose multiple folders", 'ChooseThese', "Desktop", true);
    const paths = result.split(/\r?\n/).filter(Boolean);
    assert.ok(Array.isArray(paths), 'Expected result to be an array');
    assert.ok(paths.length >= 1, 'Expected at least one path');
    console.log("✅ Multiple folders selected:", paths);
  });
});
