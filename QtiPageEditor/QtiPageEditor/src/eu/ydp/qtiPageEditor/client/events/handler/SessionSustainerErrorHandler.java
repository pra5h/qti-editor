package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.SessionSustainerErrorEvent;

/**
 * Interface that defines hander for {@link SessionSustainerErrorEvent}
 * @author thanczewski
 *
 */
public interface SessionSustainerErrorHandler extends EventHandler {
	/**
	 * Called when SessionSustainerErrorEvent is fired.
	 * @param event the {@link SessionSustainerErrorEvent} that was fired
	 */
	void onSessionSustainerError(SessionSustainerErrorEvent event);

}
