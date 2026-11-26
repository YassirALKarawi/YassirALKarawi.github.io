'use strict';
async function radioResult(name,parameters,signal){
 const response=await fetch('https://diyala-radio-results.yassirameen22.chatgpt.site/'+name,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(parameters),signal});
 if(!response.ok)throw new Error('Calculation unavailable');
 return response.json();
}
