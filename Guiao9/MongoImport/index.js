const { exec } = require('child_process');
var args = process.argv.slice(2);

if(args.length < 3)
{
    console.error("Usage: node index.js <database> <collection> <json_file_path>");
    return -1;
}

exec(`mongoimport -d ${args[0]} -c ${args[1]} --jsonArray "${args[2]}"`)
