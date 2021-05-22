const { Octokit } = require('@octokit/rest')
const fs = require('fs');
const gitconfig = require("../Config/git.json")
const sheetId = require('../Config/sheet.json')
const {google} = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { builtinModules } = require('module');

const arr=[];
const octokit = new Octokit({
    auth:gitconfig.token
})  //Intializing Octakit

async function GetAllRepo(org){   //Get all the repository from Github
    ans=await octokit.rest.repos.listForUser({
        username:org,
        //org:org
      });
      repository = {}
      no_of_repo = ans.data.length
      for(repo=0;repo<no_of_repo;repo++)
      {
          const repos = ans.data[repo].name
          if(ans.data[repo].private == true){
            repository[repos] = "private"
            // console.log("private")
          }
          else
          repository[repos] = "public"
      }
      await GetAllBranches(repository,org)
    }
const GetAllBranches = async (repository,org) => { //get all braches for all repository
   NumberOfRepo = Object.keys(repository).length
  //  console.log(repository)
   for([repo, status] of Object.entries(repository)){
      result = await octokit.rest.repos.listBranches({
        owner:org,
        repo:repo
      });
      NumberOfBranches = result.data.length
      // console.log("Number of branches in ",repo,status,NumberOfBranches)
      let NotProtected=0,Protected=0;
      for(branch = 0;branch <  NumberOfBranches; branch++)
      {
          // console.log(ans.data)
        if(ans.data[branch]){
            if(ans.data[branch].protected == false)
            {
              //  console.log(ans.data[branch].name,"=> not protected")
              NotProtected=NotProtected+1
            }
            else
            {
              // console.log(ans.data[branch].name,"=>protected")
              Protected=Protected+1;
            }
          }
      }
      NotProtectedBraches = NumberOfBranches-Protected
      // console.log("Protected Branch",Protected)
      // console.log("NotProducted Branch",NotProtectedBraches)
      await GetAllCollabration(org,repo,status,NumberOfBranches,Protected,NotProtectedBraches)
   }
}
async function GetAllCollabration(org,repository,status,NumberOfBranches,Protected,NotProtectedBraches) {
  //CollabratorsAndPermission = {}

 // Permission=[]
   
  try{
    const ans=await octokit.rest.repos.listCollaborators({
        owner:org,
        repo:repository,
      });
      
      //arr=[]
      arr.push(["REPOSITORY",`${repository}`]);
      arr.push(["STATUS",`${status}`]);
      arr.push(["NUMBER OF BRANCHES ",`${NumberOfBranches}`]);
      arr.push(["NUMBER OF PROTECTED BRANCHES",`${Protected}`]);
      arr.push(["NUMBER OF NON-PROTECTED BRANCHES",`${NotProtectedBraches}`])
     // console.log(arr)
     var arr1=["COLLABORATORS"];
     arr.push(arr1)

      for(repo=0;repo<ans.data.length;repo++)
      {
        var arr2=[];
        //arr2.push("");
        arr2.push("");
          let collabrators = ans.data[repo].login
          arr2.push(collabrators);
          let permission = ans.data[repo].permissions
          if(permission.admin==true)
          {
            arr2.push("admin");
          }
          if(permission.push==true)
          {
            arr2.push("push");
          }
          if(permission.pull==true)
          {
            arr2.push("pull");
          }        
           arr.push(arr2);    
           console.log(arr2)
        
  } 

}
  

catch(error){
 // console.log("You don't have the permission for ",repository)
  //console.log("Number of Branches ",NumberOfBranches+"\n")
 // console.log("Number of Protected Branches ",Protected+"\n")
 // console.log("Number of Non Protected Branches",NotProtectedBraches+"\n")
}
}

//GetAllRepo(org="snehashree-powerofn")

async  function addValues(auth) { 
  //console.log("Hi") 
const sheets = google.sheets({version:'v4', auth});
await GetAllRepo(org="praveen-powerofn")  
sheets.spreadsheets.values.append({
  spreadsheetId:sheetId.id,
  range: 'Sheet1',
  valueInputOption: 'RAW',    
  resource: {
    values: arr,    
  }  }, 
    (err, result) => {
      if (err) {
          // Handle error
          console.log(err);
      } else {
          console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
      }

})  
}

module.exports={addValues}




