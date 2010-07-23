package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.TinyMcePreviewEvent;
/**
 * Handler for {@link TinyMcePreviewEvent} event
 * @author thanczewski
 *
 */
public interface TinyMcePreviewHandler extends EventHandler {
	
	/**
	 * Called when TinyMcePreviewEvent is fired
	 * @param event the {@link TinyMcePreviewEvent} that was fired.
	 */
	void onShowPreview(TinyMcePreviewEvent event);

}
