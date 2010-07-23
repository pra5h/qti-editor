package eu.ydp.qtiPageEditor.client.model.vo;

import com.google.gwt.junit.client.GWTTestCase;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;


public class QtiTestModelTest extends GWTTestCase {

	@Override
	public String getModuleName() {
		return "eu.ydp.qtiPageEditor.QtiPageEditor";
	}
	
	public void testSetContent(){
		QtiTestModel model0 = new QtiTestModel();
		QtiTestModel model1 = new QtiTestModel();
				
		
		model0.addNewPage();
		model0.addNewPage();
		
		model1.setContent(model0.getContent());				
		
		
		assertEquals(model0.getContent(), model1.getContent());
		
	}
	
	public void testGetItemsHrefs(){
		QtiTestModel model = new QtiTestModel();
		String[] hrefs;
		String fileName;
		int i;		
		for(i = 0; i< 10;  i++)
			model.addNewPage();
		
		assertEquals(10, model.getItemsHrefs().length);
		
		hrefs = model.getItemsHrefs();
		for(i = 0; i < 10; i++){
			fileName = "/page_"+i+".xml";
			 assertTrue(hrefs[i].indexOf(fileName) == hrefs[i].length()- fileName.length() );
		}
		
	}
	
	public void testAddNewPage(){
		QtiTestModel model = new QtiTestModel();
		
		int i;		
		for(i = 0; i< 10;  i++)
			model.addNewPage("pages/page"+i);
		
		assertEquals(10, model.getItemsHrefs().length);
		
		for(i = 0; i < 10; i++ ){
			assertEquals("pages/page"+i, model.getItemsHrefs()[i]);
		}
	}
	
	public void testRemovePage(){		
		QtiTestModel model = new QtiTestModel();		
		int i;		
		for(i = 0; i< 10;  i++)
			model.addNewPage("pages/page"+i);
		
		model.removePage(0);
		model.removePage(0);
		model.removePage(0);
		
		assertEquals(7, model.getItemsHrefs().length);
		

		for(i = 0; i < 7; i++ ){
			assertEquals("pages/page"+(i+3), model.getItemsHrefs()[i]);
		}
		
	}
	
	public void testSwapItems()
	{
		
		QtiTestModel model = new QtiTestModel();		
		String before = model.getContent();
		
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		
		model.swapItems(0, 2);
		
		assertNotSame(model.getContent(),before);
		assertNotSame(model.getItemsHrefs()[0], model.getItemsHrefs()[2] );
		assertNotSame(model.getItemsHrefs()[0], model.getItemsHrefs()[1] );
		assertNotSame(model.getItemsHrefs()[2], model.getItemsHrefs()[2] );
		
		assertTrue(model.getItemsHrefs()[0].indexOf("page_2") > -1);
		assertTrue(model.getItemsHrefs()[2].indexOf("page_0") > -1);
	}
	
	public void testMoveDown(){
		QtiTestModel model = new QtiTestModel();	
		String before = model.getContent();
		
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		
		model.moveDown(0);
		
		assertNotSame(model.getContent(),before);
		assertNotSame(model.getItemsHrefs()[0], model.getItemsHrefs()[1] );
		assertNotSame(model.getItemsHrefs()[1], model.getItemsHrefs()[2] );
		assertNotSame(model.getItemsHrefs()[2], model.getItemsHrefs()[3] );
		
		assertTrue(model.getItemsHrefs()[0].indexOf("page_1") > -1);
		assertTrue(model.getItemsHrefs()[1].indexOf("page_0") > -1);
		
		model = new QtiTestModel();		
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		
		model.moveDown(3);
		
		assertTrue(model.getItemsHrefs()[0].indexOf("page_3") > -1);
		assertTrue(model.getItemsHrefs()[1].indexOf("page_0") > -1);	
		assertTrue(model.getItemsHrefs()[2].indexOf("page_1") > -1);
		assertTrue(model.getItemsHrefs()[3].indexOf("page_2") > -1);
		
	}
	
	public void testMoveUp(){
		QtiTestModel model = new QtiTestModel();	
		String before = model.getContent();
		
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		
		model.moveUp(3);
		
		assertNotSame(model.getContent(),before);
		assertNotSame(model.getItemsHrefs()[0], model.getItemsHrefs()[1] );
		assertNotSame(model.getItemsHrefs()[1], model.getItemsHrefs()[2] );
		assertNotSame(model.getItemsHrefs()[2], model.getItemsHrefs()[3] );
		
		assertTrue(model.getItemsHrefs()[2].indexOf("page_3") > -1);
		assertTrue(model.getItemsHrefs()[3].indexOf("page_2") > -1);
		
		model = new QtiTestModel();		
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		model.addNewPage();
		
		model.moveUp(0);
		
		assertTrue(model.getItemsHrefs()[0].indexOf("page_1") > -1);
		assertTrue(model.getItemsHrefs()[1].indexOf("page_2") > -1);	
		assertTrue(model.getItemsHrefs()[2].indexOf("page_3") > -1);
		assertTrue(model.getItemsHrefs()[3].indexOf("page_0") > -1);
		
		
	}
	
	public void testGetAssessmentForPage(){
		QtiTestModel model = new QtiTestModel();	
		QtiTestModel modelForPage;
		Document assessment;
		int i;
		
		for(i = 0; i < 4; i++)
			model.addNewPage();
		
		for(i = 0; i < 4; i++){
			
			assessment = model.getAssessmentForPage(i);
			NodeList nodes = assessment.getElementsByTagName("assessmentItemRef");		
			assertEquals(1, nodes.getLength());
			
			modelForPage = new QtiTestModel();
			modelForPage.setContent(assessment.toString());
			
			assertTrue(modelForPage.getItemsHrefs()[0].indexOf("page_"+i) > -1);
			assertTrue(modelForPage.getItemsHrefs().length == 1);
			
		}	
		
	}

}
