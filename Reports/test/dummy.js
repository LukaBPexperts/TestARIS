var filePath = "C:\\batch\\batchfile.bat";
var exportLocation = "C:/ARISScriptExports";
var df = new java.text.SimpleDateFormat("yyyy_MM_dd_hh_mm");
var outputLocation = exportLocation + "/" + df.format( new Date() ); 

var rootDirectory = "C:\\CloneARIS";

var oOutput = Context.createOutputObject();
var nLocale = Context.getSelectedLanguage();

var allClonedFiles = [];
var allClonedFilePaths = [];
var tableValues = [];

var scriptAdminComponent = Context.getComponent("ScriptAdmin");
var aScriptComponentInfo = scriptAdminComponent.getScriptComponents();

var selected = [];
var selected_values = [];


//main();
commonFilesLister();
main();

var arr = [];
arr.push(["el1", "0"]);
arr.push(["el2 a", "1"]);
arr.push(["el3", "2"]);


oOutput.OutputTxt(arr.findIndex(function(subArray){return subArray[0] === "el2 a";}));
oOutput.WriteReport();

function main()
{
        //var categories = scriptAdminComponent.getCategories(0, nLocale);
        
         var aScriptComponentInfo = scriptAdminComponent.getScriptComponents()
         
         var fileData2 = Packages.java.nio.file.Files.readAllBytes(Packages.java.nio.file.Paths.get("C:\\ARISScriptExports\\2023_08_16_09_35\\Common files\\dummyCommon.js"));  //test
         
         var found = false;
         
         //var id = scriptAdminComponent.importFile(0, null, "dummyCommon.js", fileData2);  //test
         
         //var ID = aScriptComponentInfo[0].getComponentID()
	     var sComponent = aScriptComponentInfo[0].getComponentName()
         
         //var ComponentID_CommonFiles = aScriptComponentInfo[0].getComponentID();   -> 0
         
         var listCommonFilesScriptInfos = scriptAdminComponent.getScriptInfos(0, null, nLocale);
         
         var Dlg2 = null;
         Dlg2 = Dialogs.showDialog(new userDialog2(), Constants.DIALOG_TYPE_ACTION, "Pull ARIS script from GitHub");
         

         
         
         
         for(var i = 0; i < listCommonFilesScriptInfos.length; i++){
            if(listCommonFilesScriptInfos[i].getName() == "dummyCommon.js"){
                found = true;
            }
         }
         
         var categories = scriptAdminComponent.getCategories(0, nLocale);
        
        //oOutput.OutputTxt(id);
        //oOutput.WriteReport();
}

function commonFilesLister()
{
    var jsFiles = [];
    var commonDirectory = new Packages.java.io.File(rootDirectory + "\\" + gitRepo + "\\Common files");
    
    var commonFiles = commonDirectory.listFiles();

    if(commonFiles != null)
        {
            for(var i = 0; i < commonFiles.length; i++)
                {
                    if(commonFiles[i].getName().endsWith(".js"))
                        {
                            allClonedFiles.push(commonFiles[i].getName());
                            allClonedFilePaths.push(commonFiles[i].getAbsolutePath());
                        }
                }
        }
}

function userDialog2 () {
    
    var pageIndexSelectDocument = 0;
    var laFilteredTableValues = new Array();
    
    for(var i = 0; i < allClonedFiles.length; i++)
        {
            tableValues.push([allClonedFiles[i], "Common files"]);
            tableValues.push([allClonedFiles[i], "Common files"]);
        }
        
    
    this.getPages = function(){

        
    var userDlg = Dialogs.createNewDialogTemplate(650, 300, "Select Scripts to push to GitHub"); 
    userDlg.GroupBox(15, 20, 620, 275, "Select script to be pulled");    
    userDlg.Text(35, 35, 200, 15, "Select script");
    userDlg.Text(35, 55, 100, 15, "Search by name:");
    userDlg.TextBox(130, 55, 155, 13, "Document_txtSearch", 0);
    //userDlg.ListBox(35, 75, 250, 180, allClonedFiles, "All_scripts", 0);  //ListBox of all scripts  
    userDlg.PushButton(300, 145, 50, 30, "<SYMBOL_ARROWRIGHT>", "Document" + "_btnAdd");
    userDlg.Text(365, 55, 200, 15, "Selected script");
    //userDlg.ListBox(365, 75, 250, 180, [], "Selected_scripts");  //ListBox of selected scripts
    userDlg.PushButton(365, 260, 70, 20, "Delete", "Document" + "_btnDel");  //Delete button
    
    var laColumnHeaders=new Array();
    var laColumnWidths=[200,50];
    laColumnHeaders.push("Name");
    laColumnHeaders.push("Type");
    userDlg.Table(35, 75, 250, 180, laColumnHeaders,null,laColumnWidths,"tblDocuments",Constants.TABLE_STYLE_DEFAULT);
    
    userDlg.Table(365, 75, 250, 180, laColumnHeaders,null,laColumnWidths,"tblDocuments2",Constants.TABLE_STYLE_DEFAULT);
    
    userDlg.OKButton();
    userDlg.CancelButton();
    
     
     this.init = function(){
            this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments").setItems(tableValues);
     }
    //*********************************************************************************************************
                //ACTION HANDLERS
    //*********************************************************************************************************
    
    
    //Search all scripts
    this.Document_txtSearch_changed = function() {
        this.executeSearch(this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Document_txtSearch"), tableValues, this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments"), 0);
    };
    
    this.executeSearch = function(oSearchBox, listUnfilteredValues, oTableDlgElement,intColumnIndexToSearch) {
        var lsFilterText = oSearchBox.getText();
        
        
        
        listUnfilteredValues.forEach(function(row) {
            {
                if (row[intColumnIndexToSearch].toLowerCase().indexOf(lsFilterText.toLowerCase()) !== -1) {
                    laFilteredTableValues.push(row);
                }
            }
        });
        oTableDlgElement.setItems(laFilteredTableValues);
    }
    
    //Add selected script    
    this.Document_btnAdd_pressed = function() 
    {   
        var selected_index = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments").getSelection();
        
        //1. Check if anything is selected. 2.Check if script is already selected
        if(this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments2").getItems()[0] == undefined)
            {
                selected_values.push([tableValues[selected_index[0]][0], tableValues[selected_index[0]][1]]);
                this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments2").setItems(selected_values);
                selected_values.splice(0, 1);
            }
    }
    
    //Delete selected script
    this.Document_btnDel_pressed = function() 
    {   
        this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments2").setItems([]);
    }
    
    this.onClose = function()
    {
        //selected_folder = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Document_selected_folder").getValue();
        selected = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("tblDocuments2").getItems();
    }
    
    var listPagesToShow = [];
    listPagesToShow.push(userDlg);
         
    return listPagesToShow;
    }
}
