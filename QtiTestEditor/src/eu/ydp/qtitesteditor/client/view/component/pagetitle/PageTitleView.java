package eu.ydp.qtitesteditor.client.view.component.pagetitle;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

import eu.ydp.qtitesteditor.client.events.SetPageTitleEvent;
import eu.ydp.qtitesteditor.client.events.handler.PageTitleEnteredHandler;

public class PageTitleView extends DialogBox {

	@UiField Button _butOk;
	@UiField Button _butCancel;
	@UiField TextBox _txtTitle;
	
	final private HandlerManager _handlerManager = new HandlerManager(this);
	
	private static PageTitleViewUiBinder uiBinder = GWT
			.create(PageTitleViewUiBinder.class);

	interface PageTitleViewUiBinder extends UiBinder<Widget, PageTitleView> {
	}
	
	public PageTitleView() {
		setWidget(uiBinder.createAndBindUi(this));
		setText("Page title");		
	}
	
	@UiHandler("_butCancel")
	protected void onClickCancel(ClickEvent event){		
		hide();		
	}
	
	@UiHandler("_butOk")
	protected void onClickOk(ClickEvent event){		
		if(_txtTitle.getText().length() > 0){
			_handlerManager.fireEvent(new SetPageTitleEvent(_txtTitle.getText()));
			hide();
		}	
	}	
	
	public void setPageTitle(String title){
		_txtTitle.setText(title);
	}
	
	public void addTitleEnteredListener(PageTitleEnteredHandler handler){
		_handlerManager.addHandler(SetPageTitleEvent.TYPE, handler);
		
	}

}
