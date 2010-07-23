package eu.ydp.qtiPageEditor.client.events;

import com.google.gwt.event.shared.GwtEvent;
import eu.ydp.qtiPageEditor.client.events.handler.TinyMceResizeHandler;

/**
 * 
 * @author thanczewski
 * Event dispatched when TinyMCE control is resized.
 *
 */
public class TinyMceResizeEvent extends GwtEvent<TinyMceResizeHandler> {
	
	public static final Type<TinyMceResizeHandler> TYPE = new Type<TinyMceResizeHandler>();
	
	private int _width;
	private int _height;
	
	public TinyMceResizeEvent(int width, int height){
		_width = width;
		_height = height;
	}
	@Override
	protected void dispatch(TinyMceResizeHandler handler) {
		handler.onTinyResize(this);		
	}	
	
	@Override
	public Type<TinyMceResizeHandler> getAssociatedType() {
		return TYPE;
	}
	
	public int getTinyMceWidth(){
		return _width;
	}
	
	public int getTinyMceHeight(){
		return _height;
	}


}
