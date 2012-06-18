package eu.ydp.qtiPageEditor.client.view.component.yesno;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;

import eu.ydp.qtiPageEditor.client.events.DialogYesNoEvent;
import eu.ydp.qtiPageEditor.client.events.handler.DialogYesNoHandler;

public class YesNoDialog extends DialogBox {
	
	interface YesNoDialogBinder extends UiBinder<Widget, YesNoDialog> {}
	private static YesNoDialogBinder uiBinder = GWT.create(YesNoDialogBinder.class);	
	
	final private HandlerManager _handlerManager = new HandlerManager(this);

	@UiField Button _okButton;
	@UiField Button _cancelButton;
	@UiField HTML _text;
	
	
	
	public YesNoDialog(){
		super(false, true);
		setGlassEnabled(true);		
		setWidget(uiBinder.createAndBindUi(this));				
	}
	
	public void showDialog(String title, String message){
		setText(title);
		_text.setText(message);
		this.center();
	}
	
	public void showDialogHtml(String title, String message){
		setText(title);
		_text.setHTML(message);
		this.center();
	}
	
	@UiHandler("_okButton")
	protected void onOkClick(ClickEvent event){
		doOnClick((Button)event.getSource());
	}
	
	@UiHandler("_cancelButton")
	protected void onOkCancel(ClickEvent event){
		doOnClick((Button)event.getSource());
	}
	
	private void doOnClick(Button butt){
		DialogYesNoEvent dialogEvent;		
		String res = (butt.equals(_okButton)) ? DialogYesNoEvent.DIALOG_YES : DialogYesNoEvent.DIALOG_NO;
		
		dialogEvent = new DialogYesNoEvent(res);
		_handlerManager.fireEvent(dialogEvent);	
		
		hide();
	}
	
	public void addDialogYesNoHandler(DialogYesNoHandler handler){
		_handlerManager.addHandler(DialogYesNoEvent.TYPE, handler);
	}

}
