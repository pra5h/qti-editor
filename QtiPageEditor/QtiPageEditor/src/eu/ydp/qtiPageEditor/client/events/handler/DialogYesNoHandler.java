package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.DialogYesNoEvent;
/**
 * Interface for eu.ydp.qtiPageEditor.client.events.DialogYesNoEvent event handler
 * @author thanczewski
 *
 */
public interface DialogYesNoHandler extends EventHandler {
	/**
	 * Called when DialogYesNoEvent event is fired.
	 * @param event the {@link EventHandler} that was fired 
	 */
	void onYesNoClick(DialogYesNoEvent event);
}
