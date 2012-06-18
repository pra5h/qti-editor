package eu.ydp.qtiPageEditor.client.model.vo;

import com.google.gwt.core.client.GWT;
import com.google.gwt.junit.client.GWTTestCase;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Text;
import com.google.gwt.xml.client.XMLParser;
public class QtiPageModelTest extends GWTTestCase {
	
	QTIPageModel _model;
	
	
	@Override
	public String getModuleName() {
		return "eu.ydp.qtiPageEditor.QtiPageEditor";
	}
	
	public void testGetTitle(){
		_model = new QTIPageModel();
		assertEquals("Unknown title", _model.getTitle());
	}
	
	public void testSetTitle(){
		_model = new QTIPageModel();
		String title = "myTitle";		
		String resultTitle;
		
		_model.setTitle(title);
		resultTitle = _model.getTitle();
		
		assertEquals(resultTitle, title);	
		
	}
	
	public void testSetPath(){		
		_model = new QTIPageModel();	
		
		_model.setPath(GWT.getModuleBaseURL());
		
		assertEquals(GWT.getModuleBaseURL(), _model.getPath());
		
	}
	
	public void testSetContent(){
		_model = new QTIPageModel();
		Document orginalDocument = getPageDocument();
		
		_model.setContent(orginalDocument.toString());
		
		assertEquals(orginalDocument.getDocumentElement().getAttribute("title"), _model.getTitle());
		
		assertEquals(orginalDocument.toString(), _model.getContent());
		
		
		
	}
	
	private Document getPageDocument(){
		Document doc = XMLParser.createDocument();
		Element item = doc.createElement("assessmentItem");

		item.setAttribute("xmlns", "http://www.imsglobal.org/xsd/imsqti_v2p1");
		item.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");		
		item.setAttribute("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd");
		item.setAttribute("xmlns:qy", "http://www.ydp.eu/qti/qti_ydp/");
		item.setAttribute("identifier", "");		
		item.setAttribute("adaptive", "false");
		item.setAttribute("timeDependent", "false");
		item.setAttribute("title", "myTitle");
		
		doc.appendChild(item);
		
		Element body = doc.createElement("itemBody");		
		item.appendChild(body);
		
		Element paragraph = doc.createElement("p");
		Text text = doc.createTextNode("this is simple qti assessment item");
		
		paragraph.appendChild(text);
		
		body.appendChild(paragraph);
		
		
		
		return doc;
	}

}
