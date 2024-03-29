package eu.ydp.qtiPageEditor.client.view.component.preview;


import java.io.Console;

import com.allen_sauer.gwt.log.client.ConsoleLogger;
import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DeferredCommand;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.Widget;
import com.qtitools.player.client.Player;
import com.qtitools.player.client.controller.communication.FlowOptions;
import com.qtitools.player.client.controller.communication.PageItemsDisplayMode;
import com.qtitools.player.client.util.xml.document.XMLData;


public class PreviewView extends DialogBox {
	
	interface PreviewViewBinder extends UiBinder<Widget, PreviewView>{};
	private static PreviewViewBinder uiBinder = GWT.create(PreviewViewBinder.class);
	
	@UiField FlowPanel _playerContainer;
	@UiField Button _closeButton;	
	@UiField ScrollPanel _scrollPanel;
	
	private Player _player;	
	
	private XMLData _assessment;
	private XMLData[] _items;
	
	
	public PreviewView(){		
		
		super(false, true);
		setGlassEnabled(true);		
		setText("Preview");
		setWidget(uiBinder.createAndBindUi(this));		
	}
	
	public void showPreview(XMLData assessmentData , XMLData[] itemsData){	
		
		setPopupPositionAndShow(new PositionCallback() {
			
			@Override
			public void setPosition(int offsetWidth, int offsetHeight) {
				updateSizeAndPosition();
			}
		});
		
		Window.addResizeHandler(new ResizeHandler() {			
			@Override
			public void onResize(ResizeEvent event) {
				if(_scrollPanel != null){
					updateSizeAndPosition();
				}				
			}
		});
			
		
		_assessment = assessmentData;
		_items = itemsData;
		
	}
	
	@UiHandler("_closeButton")
	protected void onClick(ClickEvent event){
		hide();
	}
	
	@Override
	protected void onAttach() {
		super.onAttach();
		
		DeferredCommand.addCommand(new Command() {			
            public void execute() {            	
            	if(_player != null)
            		_playerContainer.clear();
            		
        		_player = new Player(_playerContainer);
        		FlowOptions o = new FlowOptions();
        		o.itemsDisplayMode = PageItemsDisplayMode.ONE;
        		o.showSummary = false;
        		o.showToC = false;
        		_player.setFlowOptions(o);        		
        		
        		_player.load(_assessment, _items);
        	
            }
        });
	}
	
	private void updateSizeAndPosition(){
		int windowWidth = Window.getClientWidth(); 
		int windowHeight = Window.getClientHeight();
		int offsetHeight = 80;
				
		if(windowWidth- 50 > 0)
			_scrollPanel.setWidth(String.valueOf(windowWidth- 50)+"px");		
		
		if(windowHeight - offsetHeight - 30 > 0)
			_scrollPanel.setHeight(String.valueOf(windowHeight - offsetHeight - 30 )+"px");
			
		int left = (windowWidth - (windowWidth- 30))/2;
		int top = (windowHeight - (windowHeight- 30))/2;
		
		setPopupPosition(left, top);				
	}
	
	
	
	

}
