package eu.ydp.qtiPageEditor.client.bundle;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;

public interface Assets extends ClientBundle {

	public static final Assets INSTANCE =  GWT.create(Assets.class);
	
	@Source("eu/ydp/qtiPageEditor/assets/file_swf.png")
	ImageResource swfIcon();

	@Source("eu/ydp/qtiPageEditor/assets/movie.png")
	ImageResource movieIcon();

	@Source("eu/ydp/qtiPageEditor/assets/sound.png")
	ImageResource soundIcon();
	
	@Source("eu/ydp/qtiPageEditor/assets/blank.png")
	ImageResource blankIcon();

}
