package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;

import eu.ydp.qtiPageEditor.client.events.handler.TinyMceCreatedHandler;

public class TinyMceCreatedEvent extends GwtEvent<TinyMceCreatedHandler> {
	
	public static final Type<TinyMceCreatedHandler> TYPE = new Type<TinyMceCreatedHandler>();
	
	@Override
	protected void dispatch(TinyMceCreatedHandler handler) {
		handler.onTinyMceCreated(this);
		
	}
	
	@Override
	public Type<TinyMceCreatedHandler> getAssociatedType() {
		return TYPE;
	}
	
}
