package eu.ydp.qtiPageEditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtiPageEditor.client.events.TinyMceCreatedEvent;

public interface TinyMceCreatedHandler extends EventHandler {
	
	void onTinyMceCreated(TinyMceCreatedEvent event);
}
