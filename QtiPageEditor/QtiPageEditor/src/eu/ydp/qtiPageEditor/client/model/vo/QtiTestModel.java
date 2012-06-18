package eu.ydp.qtiPageEditor.client.model.vo;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;
import com.google.gwt.xml.client.impl.DOMParseException;


public class QtiTestModel {
	
	private Document _content;
	private int _nextPageId;
	
	
	
	public QtiTestModel(){
		
		Document doc = XMLParser.createDocument();
		
		Element assessmentTest = doc.createElement("assessmentTest");
		Element testPart = doc.createElement("testPart");
		Element section = doc.createElement("assessmentSection");
		
		assessmentTest.appendChild(testPart);
		testPart.appendChild(section);
		doc.appendChild(assessmentTest);
		
		_content = doc;
		
		
		_nextPageId = 0;
	}
	
	public void setContent(String test) throws DOMParseException{		
		_content = XMLParser.parse(test);
		
		if(_content.getDocumentElement().getAttribute("nextPageId") != null)
			_nextPageId = Integer.parseInt(_content.getDocumentElement().getAttribute("nextPageId"));
			
		
	}
	
	public String[] getItemsHrefs(){
		
		String[] hrefs;
		int i;
		NodeList nodes = _content.getElementsByTagName("assessmentItemRef");	
		
		hrefs = new String[nodes.getLength()];
		
		for(i = 0; i < nodes.getLength(); i++)
			hrefs[i] = ((Element)nodes.item(i)).getAttribute("href");
		
		return hrefs;		
	}
	
	public void addNewPage()
	{		
		String path = "script_00001/page_"+_nextPageId+".xml";
		addNewPage(path);	
	}
	
	public void addNewPage(String path)
	{		
		Element el = XMLParser.createDocument().createElement("assessmentItemRef");		
		el.setAttribute("href", path);
		
		Node node = _content.getElementsByTagName("assessmentSection").item(0);
		node.appendChild(el);
		
		_nextPageId++;
		_content.getDocumentElement().setAttribute("nextPageId", Integer.toString(_nextPageId) );	
		
	}
	
	public void removePage(int ix){
		Node section = _content.getElementsByTagName("assessmentSection").item(0);
		Node toRemove = _content.getElementsByTagName("assessmentItemRef").item(ix);
		
		section.removeChild(toRemove);
		
	}
	
	public void swapItems(int from, int to){
		
		Node section = _content.getElementsByTagName("assessmentSection").item(0);
		Node page0 = _content.getElementsByTagName("assessmentItemRef").item(from);
		Node page1 = _content.getElementsByTagName("assessmentItemRef").item(to);		
		Node copy0 = page0.cloneNode(true);
		Node copy1 = page1.cloneNode(true);
		
		section.replaceChild(copy1, page0);
		section.replaceChild(copy0, page1);	
				
	}
	
	public void moveDown(int ix){
		if(ix+1 < getItemsHrefs().length)
			swapItems(ix, ix+1);
		else{
			Node page = _content.getElementsByTagName("assessmentItemRef").item(ix);
			Node pageOld = _content.getElementsByTagName("assessmentItemRef").item(0);
			Node section = _content.getElementsByTagName("assessmentSection").item(0);			
			
			section.removeChild(page);			
			section.insertBefore(page, pageOld);
			
		}
	}
	
	public void moveUp(int ix){
		if(ix > 0)
			swapItems(ix, ix-1);
		else{
			Node page = _content.getElementsByTagName("assessmentItemRef").item(0);			
			Node section = _content.getElementsByTagName("assessmentSection").item(0);		
			
			section.removeChild(page);			
			section.appendChild(page);
			
		}
			
	}
	
	public String getContent(){
		
		return _content.toString();
		
	}
	
	public Document getDocument(){
		
		return _content;
		
	}
	
	public Document getAssessmentForPage(int ix){
		Document assessment = XMLParser.parse(_content.toString());
		Node section = assessment.getElementsByTagName("assessmentSection").item(0);		
		NodeList nodesRefs = assessment.getElementsByTagName("assessmentItemRef");
		
		Node myNode = nodesRefs.item(ix).cloneNode(true);
		
		//Node parent = myNode.getParentNode();		
		
		while(section.getChildNodes().getLength() > 0){			
			section.removeChild(section.getChildNodes().item(0));
		}
		
		section.appendChild(myNode);
		
		return assessment;
		
	}
	


}
