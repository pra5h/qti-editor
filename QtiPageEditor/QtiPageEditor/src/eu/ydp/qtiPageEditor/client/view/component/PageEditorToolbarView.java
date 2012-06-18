package eu.ydp.qtiPageEditor.client.view.component;

import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.HorizontalPanel;

public class PageEditorToolbarView extends HorizontalPanel {
	
	public static final String SAVE_PRESSED = "savePressed";
	
	Button _saveButton;
	
	 
	
	public PageEditorToolbarView()
	{
		_saveButton = new Button("Save");	
		add(_saveButton);
	}
	
	public Button getSaveButton()
	{
		return _saveButton;
	}

}
