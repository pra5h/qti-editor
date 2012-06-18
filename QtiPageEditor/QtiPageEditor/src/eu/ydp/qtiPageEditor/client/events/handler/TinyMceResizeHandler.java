package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.TinyMceResizeEvent;

/**
 * Handler for {@link TinyMceResizeEvent}resize event.
 * @author thanczewski
 *
 */
public interface TinyMceResizeHandler extends EventHandler {
	/**
	 * Called when tinyMCE resize event is fired
	 * @param event the {@link TinyMceResizeEvent} that was fired
	 */
	void onTinyResize(TinyMceResizeEvent event);

}
