package eu.ydp.qtiPageEditor.client.model;

import junit.framework.Assert;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.junit.client.GWTTestCase;
import com.google.gwt.user.client.Timer;

import eu.ydp.qtiPageEditor.client.appcallback.SaveCallback;
import eu.ydp.qtiPageEditor.client.env.IEditorEnvirnoment;
import eu.ydp.qtiPageEditor.client.model.vo.QTIPageModel;
import eu.ydp.webapistorage.client.storage.IStorage;
import eu.ydp.webapistorage.client.storage.rpc.impl.RPCStorage;

public class QTIPageModelProxyTest extends GWTTestCase {

	private QTIPageModelProxy proxy;
	
	private int saveCounter = 0; 

	@Override
	public String getModuleName() {
		return "eu.ydp.qtiPageEditor.QtiPageEditor";
	}

	@Override
	protected void gwtSetUp() throws Exception {
		super.gwtSetUp();
		proxy = new QTIPageModelProxy();
		proxy.init(new IEditorEnvirnoment() {
			@Override
			public void setBasePath(String path) {
			}

			@Override
			public IStorage getStorage() {
				return RPCStorage.getInstance();
			}

			@Override
			public Object getService(String type) {
				return null;
			}

			@Override
			public String getMediaDirectory() {
				return "media";
			}

			@Override
			public String getBasePath() {
				return "/";
			}
		});
	}

	public void testAddPage() {
		proxy.addPage();
		proxy.addPage();
		proxy.addPage();
		Assert.assertEquals("QTIPageModelProxy properly added 3 pages", 3, proxy.getPageCount());
	}
	
	public void testSaveQueue() {
		
		proxy.setSaveCallback( new SaveCallback() {
			@Override
			public void onSaveError(JavaScriptObject error) {
				System.out.println("save error");
			}
			
			@Override
			public void onSaveComplete() {
				System.out.println("save completed");
				saveCounter++;
			}
		});
		
		for (int i=0;i<10;i++) {
			proxy.addPage();
			QTIPageModel page = proxy.getPage(i);
			page.setTitle("test "+i);
			page.setContent("TEST "+i);
			page.setPath("test_"+i+".page");
		}
		proxy.save(0);
		proxy.save(1);
		proxy.save(2);
		proxy.save(3);
		proxy.save(4);

		Timer timer0 = new Timer() {
			public void run() {
				System.out.println("save test in progress: " + saveCounter);
				Assert.assertTrue("some save requests have finished", saveCounter>1 );
				Assert.assertTrue("not all save requests have finished", saveCounter<5);
			}
		};
		Timer timer = new Timer() {
			public void run() {
				System.out.println("save test finished: " + saveCounter);
				Assert.assertEquals("all save request have finished",5,saveCounter);
				finishTest();
			}
		};

		// Set a delay period significantly longer than the
		// event is expected to take.
		delayTestFinish(4000);
		
		// check if all 
		timer0.schedule(500);
		
		// Schedule the event and return control to the test system.
		timer.schedule(2000);
		
	}

}
