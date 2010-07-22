package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;
import eu.ydp.qtiPageEditor.client.events.handler.DialogYesNoHandler;

/**
 * 
 * @author thanczewski
 * Event dispatched when user clicks "yes" or "no" button on YesNoDialog
 */
public class DialogYesNoEvent extends GwtEvent<DialogYesNoHandler> {
	
	public static final String DIALOG_YES = "dialogYes";
	public static final String DIALOG_NO = "dialogNo";	
	 
	private String _result;
	public static final Type<DialogYesNoHandler> TYPE = new Type<DialogYesNoHandler>();
	
	/**
	 * 
	 * @param yesNo
	 */
	public DialogYesNoEvent(String yesNo){
		super();
		_result = yesNo;
	}
	
	@Override
	protected void dispatch(DialogYesNoHandler handler) {
		handler.onYesNoClick(this);
		
	}
	
	@Override
	public Type<DialogYesNoHandler> getAssociatedType() {		
		return TYPE;
	}
	
	public String getResult(){
		return _result;
	}

}
