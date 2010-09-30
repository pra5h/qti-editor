package eu.ydp.qtitesteditor.client.events;

import com.google.gwt.event.shared.GwtEvent;

import eu.ydp.qtitesteditor.client.events.handler.PageTitleEnteredHandler;

public class SetPageTitleEvent extends GwtEvent<PageTitleEnteredHandler> {
	
	public static final String TITLE_ENTERED = "titleEntered";
	public static final Type<PageTitleEnteredHandler> TYPE = new Type<PageTitleEnteredHandler>();
	String _title;
	
	public SetPageTitleEvent(String title){
		super();
		_title = title;
	}
	
	@Override
	protected void dispatch(PageTitleEnteredHandler handler) {
		handler.onTitleEntered(this);
		
	}
	
	@Override
	public Type<PageTitleEnteredHandler> getAssociatedType() {		
		return TYPE;
	}
	
	public String getTitle(){
		return _title;
	}
}
