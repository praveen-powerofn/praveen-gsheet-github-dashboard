const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const creden=require('../Config/credentials.json');
const access=require('./token.json');
const {addValues}=require('../Github/github')


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = 'token.json';

fs.readFile('Config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), addValues);
})
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }


var oAuth2Client = new google.auth.OAuth2(
  creden.web['client_id'], creden.web['client_secret'] ,creden.web['redirect_uris']);

  oAuth2Client.setCredentials({
    refresh_token: access['refresh_token']
})

//addValues(oAuth2Client)



/*

function writeData(auth,repository,status,NumberOfBranches,Protected,NotProtectedBraches,CollabratorsAndPermission) {
    const sheets = google.sheets({ version: 'v4', auth });
    var arr=[]
        arr.push(["Repository Name",repository]),
        arr.push(["Repository Type",status]),
        arr.push(["Branches",NumberOfBranches]),
        arr.push(["Number Of Protected Branch",Protected]),
        arr.push(["Number of Non Protected Branch",NotProtectedBraches])
        var arr2=[];
   arr2.push("");
   arr2.push("")
    for(repo=0;repo<ans.data.length;repo++)
    {
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
        }  
        console.log(CollabratorsAndPermission["collo"])
    
         // ["Collaborators",Collaborators.join().replace(/,/g,'\n'),Permission.join()]
          //Permission   
    
    const resource = {
        values:arr,
    };
    sheets.spreadsheets.values.append({
        spreadsheetId: '1nFmIqe6kmpQZ_nGE7yoE8JEW3uVr_dze_wBr7yEImZY',
        range: 'Sheet1',
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
        }
    });
}


async function start(repository,status,NumberOfBranches,Protected,NotProtectedBraches,CollabratorsAndPermission)
{
  console.log(repository,status,NumberOfBranches,Protected,NotProtectedBraches,Collaborators,Permission)
  const messages = await writeData(oAuth2Client,repository,status,NumberOfBranches,Protected,NotProtectedBraches,CollabratorsAndPermission);
  //console.log(messages)
}

//const ans=start()
//console.log(ans)


// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   authorize(JSON.parse(content), listMajors);
// });

// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   authorize(JSON.parse(content), writeData);
// });

module.exports={start}
*/