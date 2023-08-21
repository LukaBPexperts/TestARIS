var nLocale   = Context.getSelectedLanguage();
var oOutput = Context.createOutputObject();

var rootDirectory = "C:\\ARISScriptExports";

var allClonedFiles = [];
var allClonedFilePaths = [];

var same = false; //dodano
var searchTxt = ""; //dodano
var suggestions = []; //dodano
var selected_folder = []; //dodano
var selected_values = []; //dodano
var _comment = ""; //dodano

var dirPath = [];

var arxi = [];

main();

function main()
{ 
    
    arxFilesLister(rootDirectory);
    
    arxi = filterArxFiles(allClonedFiles);
    
    var Dlg = null;
    Dlg = Dialogs.showDialog(new userDialog(), Constants.DIALOG_TYPE_ACTION, "Pull ARIS script from GitHub");
    
    var path = allClonedFilePaths[allClonedFiles.indexOf(selected_values[0])];
    //var path = "C:\\ARISScriptExports\\2023_08_08_03_39\\Reports\\test\\dummy.arx ";
    var match = path.match(/\\([^\\]+)\\[^\\]+$/); //match the substring between the second-to-last and last backslashes in the file path
    

    var result = match[1];

    
    //oOutput.OutputTxt(allClonedFilePaths[allClonedFiles.indexOf(selected_values[0])]);
    //oOutput.OutputTxt(arxi);
    oOutput.OutputTxt(result);
    oOutput.WriteReport();
}

function filterArxFiles(filesArray) ///////////////////////////////////////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
{
    return filesArray.filter(function(file) 
    {
        return file.endsWith(".arx");
    });
}

function arxFilesLister(directoryPath)
{
    
    var arxFiles = [];
    var directory = new Packages.java.io.File(directoryPath);
    
    if(!directory.exists() || !directory.isDirectory())
        {
            //return arxFiles;
            //return arxFilesNames;
        }
        
    var files = directory.listFiles();
    if(files != null)
        {
            for(var i = 0; i < files.length; i++)
                {
                    if(files[i].isDirectory())
                        {
                            arxFiles.push(arxFilesLister(files[i].getAbsolutePath()));
                            //arxFilesNames.push(arxFilesLister(files[i].getAbsolutePath()));
                            //arxFilesNames += arxFilesLister(files[i].getAbsolutePath());
                            //arxFilesNames.push(arxFilesLister(filePath));
                        }
                    if(files[i].getName().endsWith(".arx"))
                        {
                            //arxFiles.push(files[i].getAbsolutePath());
                            allClonedFiles.push(files[i].getName());
                            allClonedFilePaths.push(files[i].getAbsolutePath());
                            //arxFilesNames.push(files[i].getName());
                        }
                }
        }
        
    //return arxFilesNames;
    //return files;
}

//dodano sve nize
function userDialog () {
    
    var pageIndexSelectDocument = 0;
    
    this.getPages = function(){
        
    var userDlg = Dialogs.createNewDialogTemplate(650, 400, "Select Scripts to push to GitHub"); 
    
    userDlg.GroupBox(15, 20, 620, 275, "Select scripts to be pushed");    
    userDlg.Text(35, 35, 200, 15, "Select script");
    userDlg.Text(35, 55, 150, 15, "Search by script name:");
    userDlg.TextBox(170, 55, 115, 13, "Document_txtSearch", 0);
    userDlg.ListBox(35, 75, 250, 180, arxi, "All_scripts", 0);  //ListBox of all scripts  
    userDlg.PushButton(300, 145, 50, 30, "<SYMBOL_ARROWRIGHT>", "Document" + "_btnAdd");
    userDlg.Text(365, 55, 200, 15, "Selected scripts");
    userDlg.ListBox(365, 75, 250, 180, [], "Selected_scripts");  //ListBox of selected scripts
    userDlg.PushButton(35, 260, 70, 20, "Select all", "Document" + "_btnAddAll");  //Select all items button
    userDlg.PushButton(365, 260, 70, 20, "Delete", "Document" + "_btnDel");  //Delete button
    userDlg.PushButton(455, 260, 75, 20, "Delete all", "Document" + "_btnDelAll");  //Delete all button
    
    
    userDlg.GroupBox(15, 385, 620, 90, "Comment");
    userDlg.Text(35, 400, 200, 15, "Please enter your commit comment:");
    userDlg.TextBox(35, 420, 400, 35, "Git_comment",1);
    userDlg.PushButton(450, 420, 50, 30, "<SYMBOL_ARROWRIGHT>", "Document" + "_btnAddComm");
    userDlg.OKButton();
    userDlg.CancelButton();
    
     
    //*********************************************************************************************************
                //ACTION HANDLERS
    //*********************************************************************************************************
    
    
    //Search all scripts
    this.Document_txtSearch_changed = function() {
        searchTxt = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Document_txtSearch").getText();
        
        suggestions = arxi.filter(
        function(element)
        {
            return element.startsWith(searchTxt);
        }
        );
        
        this.dialog.getPage(pageIndexSelectDocument).getDialogElement("All_scripts").setItems(suggestions);
    };
    
    //Add selected script    
    this.Document_btnAdd_pressed = function() 
    {   
        var selected_index = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("All_scripts").getSelectedIndex();
        if(suggestions[0] == null)
            {
                var selected_value = arxi[selected_index];
            }
        else
            {
                var selected_value = suggestions[selected_index];
            }
        
        //1. Check if anything is selected. 2.Check if script is already selected
        if(!(arxi[selected_index] === undefined)){
            for(var i = 0; i < selected_values.length; i++){
                    if(selected_values[i] == arxi[selected_index]){
                        same = true;
                        break;
                    }
                    else{
                        same = false;
                    }
            }
            if(!same){
                selected_values.push(selected_value);
                this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").setItems(selected_values);
            }
        }
    }
    
    //Add all scripts
    this.Document_btnAddAll_pressed = function() 
    {
        var all_items = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("All_scripts").getItems();
        this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").setItems(all_items);
    }
    
    //Delete all selected scripts
    this.Document_btnDelAll_pressed = function ()
    {
        selected_values = [];
        this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").setItems(selected_values);
    }
    
    //Delete selected script
    this.Document_btnDel_pressed = function() 
    {
        var selected_index = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").getSelectedIndex();
        var selected_array = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").getItems();
        
        selected_array.splice(selected_index, 1);
        selected_values = selected_array;
        
        this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Selected_scripts").setItems(selected_array);
    }
    
    //Save comment
    this.Document_btnAddComm_pressed = function() 
    {
        _comment = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Git_comment").getText();
    }
    
    this.onClose = function()
    {
        selected_folder = this.dialog.getPage(pageIndexSelectDocument).getDialogElement("Document_selected_folder").getValue();
    }
    
    var listPagesToShow = [];
    listPagesToShow.push(userDlg);
         
    return listPagesToShow;
    }
}