package eu.ydp.qtitesteditor.client.events.handler;

import com.google.gwt.event.shared.EventHandler;

import eu.ydp.qtitesteditor.client.events.SetPageTitleEvent;

public interface PageTitleEnteredHandler extends EventHandler {
	
	void onTitleEntered(SetPageTitleEvent event);
}
