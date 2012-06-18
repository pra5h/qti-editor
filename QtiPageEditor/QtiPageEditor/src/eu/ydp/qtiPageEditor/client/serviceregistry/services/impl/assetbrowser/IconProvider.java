package eu.ydp.qtiPageEditor.client.serviceregistry.services.impl.assetbrowser;

import com.google.gwt.resources.client.ImageResource;

import eu.ydp.qtiPageEditor.client.bundle.Assets;

public class IconProvider {
	
	public static ImageResource getIcon(String file){
		String ext = file.substring(file.lastIndexOf(".")+1).toLowerCase();
		
		ImageResource res = null;
		if(ext != "bmp" && ext !="jpg" && ext !="jpeg" && ext !="png" && ext !="gif")
		{
			if(ext == "mov" || ext == "flv" || ext== "f4v" || ext == "avi" )
				res = Assets.INSTANCE.movieIcon();
			else if(ext == "swf")
				res = Assets.INSTANCE.swfIcon();
			else if(ext == "wav" || ext == "mp3")
				res = Assets.INSTANCE.soundIcon();
			else
				res = Assets.INSTANCE.blankIcon();
		}
		
		return res;
			
	}

}
