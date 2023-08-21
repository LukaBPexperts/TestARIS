/**
 * Copyright (C) 1992-2023 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.22.0.3295151
 *
 * IMPORTANT NOTE:
 *     Please note that this is a standard script provided with the product.
 *     Any changes you make to this file will be overwritten during a product update and thus be irrecoverably lost.
 *     If you want to adapt this script according to your individual needs, we urgently recommend that you create a copy of this file
 *     and add your changes to the copy. The copied file will not be overwritten by a product update.
 *     After a product update, it is advisable that you check your copied file against the updated version of the original file
 *     and add all relevant changes or fixes to your copy.
 */

Context.setProperty("excel-formulas-allowed", false); //default value is provided by server setting (tenant-specific): "abs.report.excel-formulas-allowed"

var schedulerComponent = Context.getComponent("ReportScheduler")

var sScheduleGUID = Context.getProperty("task-guid")
var sUserName     = Context.getProperty("user-name")
var sUserPwdEnc   = Context.getProperty("user-password")
var reportResult = schedulerComponent.getDecryptedScheduleResult(sScheduleGUID, sUserName, sUserPwdEnc, true)

if(reportResult.length>0)
{
    var aFileData = schedulerComponent.getZipEntries(reportResult)
    for(var i=0; i<aFileData.length; i++)
    {
        var sFileName = "" + aFileData[i].getName();
        if( sFileName=="report.result" )
            sFileName = Context.getSelectedFile()
        
        Context.addOutputFile(sFileName, aFileData[i].getData())
    }
}