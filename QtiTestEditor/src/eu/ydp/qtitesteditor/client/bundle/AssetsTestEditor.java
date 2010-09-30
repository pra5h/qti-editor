package eu.ydp.qtitesteditor.client.bundle;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;

public interface AssetsTestEditor extends ClientBundle {
	
	public static final AssetsTestEditor INSTANCE =  GWT.create(AssetsTestEditor.class);
	
	@Source("eu/ydp/qtitesteditor/assets/addPage.png")
	ImageResource addPage();

	@Source("eu/ydp/qtitesteditor/assets/deletePage.png")
	ImageResource deletePage();

	@Source("eu/ydp/qtitesteditor/assets/downArrow.png")
	ImageResource downArrow();

	@Source("eu/ydp/qtitesteditor/assets/upArrow.png")
	ImageResource upArrow();
	
	@Source("eu/ydp/qtitesteditor/assets/editTitle.png")
	ImageResource editTitle();


}
