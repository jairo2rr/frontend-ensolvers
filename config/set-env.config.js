const {writeFile, existsSync, mkdirSync} = require('fs');
const { argv } = require('yargs');
const dotenv = require('dorenv');


dotenv.config();
const environment = argv.environment;

const writeFileUsingFs = (targetPath, environmentFileContent) => {
  writeFile(targetPath, environmentFileContent, (err)=>{
    if(err) console.log(err);
    if(environmentFileContent !== '')
      console.log(`Wrote variables to ${targetPath}`);
  });
};


const envDirectory = './src/environments';
if(!existsSync(envDirectory)) mkdirSync(envDirectory);

const envProductionPath =  `${envDirectory}/environment.ts`;
const envDevelopmentPath =  `${envDirectory}/environment.develop.ts`;
writeFileUsingFs(envProductionPath, '');
writeFileUsingFs(envDevelopmentPath, '');


const isProduction = environment === 'prod';
const environmentFileContent =
