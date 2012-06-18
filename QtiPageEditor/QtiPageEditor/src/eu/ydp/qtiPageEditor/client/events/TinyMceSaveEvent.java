package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;

import eu.ydp.qtiPageEditor.client.events.handler.TinyMceSaveEventHandler;

/**
 * 
 * @author thanczewski
 * Event dispatched when user clicks "save" button in TinyMCE editor
 */
public class TinyMceSaveEvent extends GwtEvent<TinyMceSaveEventHandler> {	
	
	public static final Type<TinyMceSaveEventHandler> TYPE = new Type<TinyMceSaveEventHandler>();
	
	public TinyMceSaveEvent(){
		super();
	}
	
	@Override
	protected void dispatch(TinyMceSaveEventHandler handler) {
		handler.onPageSave(this);
		
	}
	
	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<TinyMceSaveEventHandler> getAssociatedType() {
		return TYPE;
	}

}
