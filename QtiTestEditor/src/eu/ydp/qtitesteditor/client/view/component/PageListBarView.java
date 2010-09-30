package eu.ydp.qtitesteditor.client.view.component;

import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.PushButton;

import eu.ydp.qtitesteditor.client.bundle.AssetsTestEditor;

public class PageListBarView extends Composite {
	
	private HorizontalPanel _panel;
		
	private PushButton _addPageButton;
	private PushButton _removePageButton;
	private PushButton _moveDownPageButton;
	private PushButton _moveUpPageButton;
	private PushButton _editTitleButton;
	
	public PageListBarView(){
		
		_panel = new HorizontalPanel();		
		
		_addPageButton = new PushButton(new Image(AssetsTestEditor.INSTANCE.addPage()));
		_removePageButton = new PushButton(new Image(AssetsTestEditor.INSTANCE.deletePage()));
		_moveUpPageButton = new PushButton(new Image(AssetsTestEditor.INSTANCE.upArrow()));
		_moveDownPageButton = new PushButton(new Image(AssetsTestEditor.INSTANCE.downArrow()));	
		_editTitleButton = new PushButton(new Image(AssetsTestEditor.INSTANCE.editTitle()));
		
				
		_panel.add(_addPageButton);
		_panel.add(_removePageButton);
		_panel.add(_moveUpPageButton);
		_panel.add(_moveDownPageButton);
		_panel.add(_editTitleButton);
		
		initWidget(_panel);
		
	}
	
	public PushButton getAddPageButton(){
		return _addPageButton;
	}
	
	public PushButton getRemovePageButton(){
		return _removePageButton;
	}
	
	public PushButton getMoveDownButton(){
		return _moveDownPageButton;
	}
	
	public PushButton getMoveUpButton(){
		return _moveUpPageButton;
	}	
	
	public PushButton getTitleButton(){
		return _editTitleButton;
	}
}
