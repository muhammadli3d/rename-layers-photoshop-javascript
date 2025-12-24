// renameSelected.js
// https://github.com/muhammadli3d
// Find and Replace Selected Layer Names

#target photoshop

function findReplace() {
	if (app.documents.length === 0) {
		alert("Please open document first.")
		return;
	}
	
	var doc = app.activeDocument;
	
	// 1. Get the currently selected layers (handles multi-selection)
	var selectedLayers = getSelectedLayers();
	
	if (selectedLayers.length === 0) {
		alert("No layers selected.");
		return;
	}
	
	// 2. Create user interface for Find and Replace workflow
	var win = new Window("dialog", "Rename Selected Layers");
	win.orientation = "column";
	win.alignChildren = "fill";
	
	// Find section
	var grpFind = win.add("group");
	grpFind.add("statictext", undefined, "Text to Remove:");
	var inputFind = grpFind.add("edittext", undefined, "");
	inputFind.characters = 20;
	inputFind.active = true;
	
	// Replace section
	var grpReplace = win.add("group");
	grpReplace.add("statictext", undefined, "Replace with:");
	var inputReplace = grpReplace.add("edittext", undefined, "");
	inputReplace.characters = 20;
	
	// Help text
	var helpText = win.add("statictext", undefined, "(Leave 'Replace blank to just delete the text)");
	helpText.graphics.font = ScriptUI.newFont("dialog", "Italic", 10);
	
	// Buttons
	var grpButtons = win.add("group");
	grpButtons.alignment = "center";
	var buttonOk = grpButtons.add("button", undefined, "OK");
	var buttonCancel = grpButtons.add("button", undefined, "Cancel");
	
	if (win.show() != 1) return; // Cancel pressed
	
	var findString = inputFind.text;
	var replaceString = inputReplace.text;
		
	if (findString === "") {
		alert("Please enter the text to remove.");
		return;
	}

	// Iterate backwards to avoid index shifting issues
	for (var i = 0; i < selectedLayers.length; i++) {
		setActiveLayerByIndex(selectedLayers[i]);
		var layer = doc.activeLayer;
		if (layer.name.indexOf(findString) !== -1) {
				layer.name = layer.name.replace(new RegExp(findString, "g"), replaceString);
		}
	}

	alert("Renaming complete!");
}

function getSelectedLayers() {
    var selectedLayers = [];
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
	var desc = executeActionGet(ref);
	
	if (desc.hasKey(stringIDToTypeID("targetLayers"))) {
		var layersList = desc.getList(stringIDToTypeID("targetLayers"));
		for (var i = 0; i < layersList.count; i++) {
			var layerIndex = layersList.getReference(i).getIndex();
			selectedLayers.push(layerIndex);
		}
    } else {
		// Single layer selected
		if (desc.hasKey(stringIDToTypeID("targetLayerIndex"))) {
			var layerIndex = desc.getInteger(stringIDToTypeID("targetLayerIndex"));
			selectedLayers.push(layerIndex);
		}
    }
	
	return selectedLayers;
}

function setActiveLayerByIndex(index) {
	var ref = new ActionReference();
	ref.putIndex(charIDToTypeID("Lyr "), index);
	var desc = new ActionDescriptor();
	desc.putReference(charIDToTypeID("null"), ref);
	// DialogModes.NO avoids UI flashing or dialogs
	executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
}

findReplace();
