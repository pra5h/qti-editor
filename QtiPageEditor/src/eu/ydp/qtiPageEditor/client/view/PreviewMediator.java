package eu.ydp.qtiPageEditor.client.view;

import org.puremvc.java.multicore.interfaces.INotification;
import org.puremvc.java.multicore.patterns.mediator.Mediator;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.XMLParser;
import com.qtitools.player.client.util.xml.document.XMLData;
import eu.ydp.qtiPageEditor.client.constance.Constances;
import eu.ydp.qtiPageEditor.client.model.QTIPageModelProxy;
import eu.ydp.qtiPageEditor.client.model.QTITestModelProxy;
import eu.ydp.qtiPageEditor.client.model.vo.QTIPageModel;
import eu.ydp.qtiPageEditor.client.view.component.preview.PreviewView;

public class PreviewMediator extends Mediator {	
	 
	public static final String NAME = "previewMediator";
	
	public PreviewMediator(){
				
		super(NAME, new PreviewView());
	}
	
	public void onRegister(){		
			
	}
	
	private void showPreview(INotification notification){		
		
		PreviewView preview = (PreviewView)getViewComponent();
		
		String content = (String)notification.getBody();
		Document liveDoc = XMLParser.parse(content);
		
		
		QTIPageModelProxy pageProxy = (QTIPageModelProxy)getFacade().retrieveProxy(QTIPageModelProxy.NAME);
		QTIPageModel pageInfo = pageProxy.getCurrentPage();
		QTITestModelProxy testProxy = (QTITestModelProxy)getFacade().retrieveProxy(QTITestModelProxy.NAME);
		
		String testPath = testProxy.getHref();
		testPath = testPath.substring(0, testPath.lastIndexOf("/")+1);
		String pagePath = pageInfo.getPath();
		pagePath = pagePath.substring(0, pagePath.lastIndexOf("/")+1);		
		
		XMLData assessment = new XMLData(testProxy.getAssessmentForPage(pageProxy.getSelectedIndex()), testPath);
		XMLData[] items = new XMLData[]{new XMLData(liveDoc, pagePath)};
		
		
		//preview.showPreview();
		preview.showPreview(assessment, items);
	}
	
	@Override
	public void handleNotification(INotification notification) {
		String n = notification.getName();
		if(n == Constances.SHOW_PREVIEW){
			showPreview(notification);
		}
	}
	
	@Override
	public String[] listNotificationInterests() {
		return new String[]{Constances.SHOW_PREVIEW};
	}
	
	
	
}
