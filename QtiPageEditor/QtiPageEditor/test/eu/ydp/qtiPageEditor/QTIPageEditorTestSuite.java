package eu.ydp.qtiPageEditor;

import junit.framework.Test;
import junit.framework.TestSuite;

import com.google.gwt.junit.tools.GWTTestSuite;

import eu.ydp.qtiPageEditor.client.model.vo.ModelPageListTest;
import eu.ydp.qtiPageEditor.client.model.vo.QtiPageModelTest;
import eu.ydp.qtiPageEditor.client.model.vo.QtiTestModelTest;

public class QTIPageEditorTestSuite extends GWTTestSuite {
	
	public static Test suite(){
		 TestSuite suite = new TestSuite("Test for a QtiPageEditor Application");
		   	suite.addTestSuite(ModelPageListTest.class);
		   	suite.addTestSuite(QtiPageModelTest.class);
		   	suite.addTestSuite(QtiTestModelTest.class);
		    return suite;

	}

}
