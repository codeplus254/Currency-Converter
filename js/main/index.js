
if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('sw.js').then(function(registration) {
   console.log('ServiceWorker registration successful with scope: ', registration.scope);
 }).catch(function(err) {
   //registration failed :(
   console.log('ServiceWorker registration failed: ', err);
 });
}else {
 console.log('No service-worker on this browser');
}
let amount = document.querySelector("#amount1");


let btnConvert = document.querySelector('#btnConvert');
let url = 'https://free.currencyconverterapi.com/api/v5/currencies';
let query,rate,dbPromise;
function convertCurrency(){
  dbPromise = idb.open('test-db', 5, function(upgradeDb) {
   switch(upgradeDb.oldVersion) {
     case 0:
       var keyValStore = upgradeDb.createObjectStore('keyval');
       keyValStore.put("currency rate", "currency pair");

   }
 });
    let currency1=document.getElementById("CURR_1").value;


    let currency2=document.getElementById("CURR_2").value;
  	query  = currency1 + '_' + currency2;
    queryinverse = currency2 + '_' + currency1;
  	 fetch("https://free.currencyconverterapi.com/api/v5/convert?q=" + query + "&compact=ultra", {method : "GET"})
  	  .then(response => response.json())
  	  .then(data => {
      for(con in data){   //cannot be converted to for...of loop

        
        rate=data[con];



       dbPromise.then(function(db) {
         var tx = db.transaction('keyval', 'readwrite');
         var keyValStore = tx.objectStore('keyval');
         keyValStore.put(rate, query);
         return tx.complete;
       }).then(function() {
         //console.log('Added '+query+ '':'+rate+' to keyval');
       });


      }
  	  })
  	  .catch(error => console.log(error));
      //retrieve currency from Database
      dbPromise.then(function(db) {
         let tx = db.transaction('keyval');
         let keyValStore = tx.objectStore('keyval');
         return keyValStore.get(query);
       }).then(function(val) {
              if (isNaN(val)){
                alert("Please connect to the internet or refresh the page!")
              }else{
                document.getElementById("amount2").value = document.getElementById("amount1").value *val;

              }


       });

  }
