package eu.ydp.qtiPageEditor.client.view.component;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.ScrollPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.qtitools.player.client.model.Assessment;
import com.qtitools.player.client.model.AssessmentItem;
import com.qtitools.player.client.view.PlayerWidget;

public class PreviewView extends DialogBox {
	
	PlayerWidget _player;
	VerticalPanel _contentPane;
	VerticalPanel _playerContainer;
	ScrollPanel _scrollPanel;
	
	public PreviewView(){		
		
		super(false,true);
		_player = null;
		setText("Preview");
		
	}
	
	public void init(){		
		
		_contentPane = new VerticalPanel();	
		_contentPane.setWidth("600px");
		_contentPane.setSpacing(4);		
		
		_scrollPanel = new ScrollPanel();
		_scrollPanel.setWidth("600px");
		_scrollPanel.setHeight("450px");
		
		_contentPane.add(_scrollPanel);		
		
		Button closeButton = new Button("Close", new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				hide();
			}
		});
		
		_contentPane.add(closeButton);
		_contentPane.setCellHorizontalAlignment(closeButton, HasHorizontalAlignment.ALIGN_RIGHT);
		_contentPane.setCellVerticalAlignment(closeButton, HasVerticalAlignment.ALIGN_MIDDLE);
		
		setGlassEnabled(true);
		setWidget(_contentPane);		
	}
	
	public void showPreview(Assessment assessment, AssessmentItem assessmentItem, int pageIndex ){		
		if(_player != null)
			_scrollPanel.remove(_player);
		
		_player = new PlayerWidget(assessment);
		_scrollPanel.add(_player);
		_player.setWidth("100%");
		_player.setHeight("100%");		
		
		_player.showPage(assessment, assessmentItem, pageIndex);
		
		center();
		
	}
	
	

}
