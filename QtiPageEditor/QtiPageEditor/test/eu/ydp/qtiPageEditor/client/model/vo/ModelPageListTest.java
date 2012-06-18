package eu.ydp.qtiPageEditor.client.model.vo;

import com.google.gwt.junit.client.GWTTestCase;

public class ModelPageListTest extends GWTTestCase {
	
	@Override
	public String getModuleName() {
		return "eu.ydp.qtiPageEditor.QtiPageEditor";
	}
	
	public void testGetPageCount(){		
		ModelPageList model = new ModelPageList();		
		assertEquals(0, model.getPageCount());		
		model.addPage(new QTIPageModel());		
		assertEquals(1, model.getPageCount());
	}
	
	public void testAddPage(){		
		ModelPageList model = new ModelPageList();		
		QTIPageModel page = new QTIPageModel();
		String title = "myTitle";		
		page.setTitle(title);
		
		assertEquals(0, model.getPageCount());
		
		model.addPage(new QTIPageModel());
		model.addPage(new QTIPageModel());		
		model.addPage(page);
		
		assertEquals(3, model.getPageCount());
		assertEquals(title, model.getPage(model.getPageCount()-1).getTitle());
		
	}
	
	public void testRemovePage(){		
		ModelPageList model = new ModelPageList();		
		QTIPageModel page = new QTIPageModel();
		String title = "myTitle";		
		page.setTitle(title);		
		int removeIx = 1;
		
		model.addPage(new QTIPageModel());
		model.addPage(page);
		model.addPage(new QTIPageModel());		
		
		assertEquals(3, model.getPageCount());
		
		model.removePage(removeIx);
		
		assertEquals(2, model.getPageCount());
		assertNotSame(title, model.getPage(removeIx).getTitle());
		
		model.removePage(0);
		model.removePage(0);
		assertEquals(0, model.getPageCount());
		
		
	}
	
	public void testSwapItems(){
		QTIPageModel[] pages = getPages(3);
		ModelPageList model = getModelPageList(pages);		
		
		model.swapItems(0, 1);
		
		assertEquals(model.getPage(0), pages[1]);
		assertEquals(model.getPage(1), pages[0]);
		assertEquals(model.getPage(2), pages[2]);
		
		
		assertNotSame(pages[0], model.getPage(0));
		assertNotSame(pages[1], model.getPage(1));
		assertNotSame(model.getPage(0), model.getPage(1));
		assertNotSame(model.getPage(0), model.getPage(2));
		assertNotSame(model.getPage(1), model.getPage(2));
		
	}
	
	public void testGetPage(){
		QTIPageModel[] pages = getPages(4);
		ModelPageList model = getModelPageList(pages);
		
		assertNotSame(model.getPage(0), model.getPage(1));
		assertEquals(pages[3], model.getPage(3));
		assertEquals(pages[1].getTitle(), model.getPage(1).getTitle());
		
	}
	
	public void testMoveDown(){
		QTIPageModel[] pages = getPages(4);
		ModelPageList model = getModelPageList(pages);
						
		model.moveDown(0);
		assertNotSame(model.getPage(0), model.getPage(1));
		assertEquals(pages[0], model.getPage(1));
		assertEquals(pages[1], model.getPage(0));
		
		assertEquals(pages[0].getTitle(), model.getPage(1).getTitle());
		assertEquals(pages[1].getTitle(), model.getPage(0).getTitle());
		assertEquals(pages[2].getTitle(), model.getPage(2).getTitle());
		
		
		
		pages = getPages(4);
		model = getModelPageList(pages);
		model.moveDown(3);
		
		assertEquals(pages[0].getTitle(), model.getPage(1).getTitle());
		assertEquals(pages[1].getTitle(), model.getPage(2).getTitle());
		assertEquals(pages[2].getTitle(), model.getPage(3).getTitle());
		assertEquals(pages[3].getTitle(), model.getPage(0).getTitle());
		
		
		
	}
	
	public void testMoveUp(){
		QTIPageModel[] pages = getPages(4);
		ModelPageList model = getModelPageList(pages);
						
		model.moveUp(1);
		assertNotSame(model.getPage(0), model.getPage(1));
		assertEquals(pages[0], model.getPage(1));
		assertEquals(pages[1], model.getPage(0));
		
		assertEquals(pages[0].getTitle(), model.getPage(1).getTitle());
		assertEquals(pages[1].getTitle(), model.getPage(0).getTitle());
		assertEquals(pages[2].getTitle(), model.getPage(2).getTitle());
		assertEquals(pages[3].getTitle(), model.getPage(3).getTitle());
		
		
		
		pages = getPages(4);
		model = getModelPageList(pages);
		model.moveUp(0);
		
		assertEquals(pages[0].getTitle(), model.getPage(3).getTitle());
		assertEquals(pages[1].getTitle(), model.getPage(0).getTitle());
		assertEquals(pages[2].getTitle(), model.getPage(1).getTitle());
		assertEquals(pages[3].getTitle(), model.getPage(2).getTitle());
		
		
		
	}
	
	private QTIPageModel[] getPages(int count){
		
		QTIPageModel[] pages = new QTIPageModel[count];
		int i;
		
		for(i = 0; i < count; i++){
			pages[i] = new QTIPageModel();
			pages[i].setTitle("page"+i);
		}
		
		return pages;
		
	}
	
	private ModelPageList getModelPageList(QTIPageModel[] pages){
		ModelPageList model = new ModelPageList();
		int i;
		
		for(i = 0; i < pages.length; i++)
			model.addPage(pages[i]);
		
		return model;
		
	}
	
	

}
