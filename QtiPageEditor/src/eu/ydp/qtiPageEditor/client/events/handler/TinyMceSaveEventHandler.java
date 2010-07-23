package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.TinyMceSaveEvent;

/**
 * Handler for {@link TinyMceSaveEvent}, that is fired when user clicks "save" button in TinyMCE editor.
 * @author thanczewski *
 */
public interface TinyMceSaveEventHandler extends EventHandler {
	/**
	 * Called when page save event is fired
	 * @param event the {@link TinyMceSaveEvent} that was fired
	 */
	public void onPageSave(TinyMceSaveEvent event);

}
