package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;


import eu.ydp.qtiPageEditor.client.events.handler.TinyMcePreviewHandler;

/**
 * 
 * @author thanczewski
 * Dispatched when user clicks preview button in TinyMCE control.
 *
 */
public class TinyMcePreviewEvent extends GwtEvent<TinyMcePreviewHandler> {
	
	public static final Type<TinyMcePreviewHandler> TYPE = new Type<TinyMcePreviewHandler>();
	
	public TinyMcePreviewEvent(){
		super();
	}
	
	@Override
	protected void dispatch(TinyMcePreviewHandler handler) {
		handler.onShowPreview(this);
		
	}
	
	@Override
	public Type<TinyMcePreviewHandler> getAssociatedType() {
		return TYPE;
	}

}
