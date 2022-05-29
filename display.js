
"use strict"
  $(function (){
    let searchList
    
 
  function showProgressBar(){
      $(".progressBar").css("visibility","visible")
  }
  function hideProgressBar(){
    $(".progressBar").css("visibility","hidden")

  }


    async function getJSON(){
      showProgressBar()
        const coins =  await $.ajax({url: 'https://api.coingecko.com/api/v3/coins/list'});
        hideProgressBar()
         searchList = coins
        renderList(coins)
      };
      getJSON()
      

  function renderList(list) {
    const shortList = list.slice(0, 100);
    getFiveCoins(shortList)

    shortList.forEach((item) => {
      const id = item.id;
      const name = item.name;
      const symbol = item.symbol;
      const truncString = symbol.substring(0, 20)
      $(".coins-container").append(`<div class="card col-2" >
<div class="card-body">
<label class='switch'>
  <input class='toggle' data-toggle-id='${item.name}' type='checkbox'>
  <span class='slider round'></span>
</label>
<h5 class="card-title">${truncString}</h5>
<p class="card-text">${item.name}</p>
<br>
<a href="#" data-btn-id='${item.id}' class="btn btn-primary">More-Info</a>
</div>
</div>
 `);
    });
    
    // btnClick()
  }
  


    const searchBar = document.getElementById("searchBar");

      searchBar.addEventListener("keyup", (event) => {
          console.log(event)
        const searchString = event.target.value.toLowerCase();
        const searchFiltered = searchList.filter((searchName) => {
          return (
            searchName.name.toLowerCase().includes(searchString) ||
            searchName.symbol.toLowerCase().includes(searchString)
          );
        });
        document.querySelector(".coins-container").innerHTML = "";
        renderList(searchFiltered);
      });

      $(".More-Info").hide()
      $(".container-about").hide();
      $('.container-report').hide()

      $(".about").click(function () {
        $('.More-Info').hide()
        $('.container-report').hide()
        $(".coins-container").hide();
        $(".container-about").show();
        $('.popUp').hide()
  
      });
      $(".home").on("click", function () {
        $('.popUp').hide()
        $('.container-report').hide()
        $(".More-Info").hide()
        $(".container-about").hide();
        $(".coins-container").show();
  
      });
      $('#report').on('click', function(){
        $(".coins-container").hide();
        $(".More-Info").hide()
        $('.popUp').hide()
        $('.container-report').hide()
        $('.container-report').show()

      })
      $('.report').on('click',function(){
        $(".coins-container").hide();
        $(".More-Info").hide()
        $('.popUp').hide()
        $(".container-about").hide();
        $('.container-report').show()


      })

      

   

    $(".coins-container").on("click", ".card-body > .btn-primary", function (){
        const coinId = $(this).attr("data-btn-id");
        btnMoreInfo(coinId)


    }
    )
  

    async function btnMoreInfo(coinId){
      try{
        let coinInfo = JSON.parse(localStorage.getItem(coinId));
        
        if(coinInfo){
          console.log(coinInfo)
          $('.coins-container').hide()
          displayMoreInfo(coinInfo)


        }
        else{

      showProgressBar()
      const specificCoin =  await $.ajax({url: `https://api.coingecko.com/api/v3/coins/${coinId}`})
      $('.coins-container').hide()
      displayMoreInfo(specificCoin)      
      localStorage.setItem(coinId, JSON.stringify(specificCoin));
      setTimeout(() => localStorage.removeItem(coinId), 120000);
      hideProgressBar()

   
    }
     
    }
    
    catch (error){
      // $('.More-Info').append()

    }
      }

      
      
      function displayMoreInfo(specificCoin){
        $(".More-Info").empty()
        $(".More-Info").show()
        $('.More-Info').append(`<div class="card MoreInfo" style="width: 35rem;">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img class="card-img-top" src="${specificCoin.image.large}" alt="Card image cap">
        <div class="card-body">
          <p class="card-text"><p>
          ${specificCoin.name}
          </p>
          price:<p> 
          usd: ${specificCoin.market_data.current_price.usd}$  </p>
          <p>euro: ${specificCoin.market_data.current_price.eur}€ </p>
          <p>ILS: ${specificCoin.market_data.current_price.ils}₪ </p>     
          </p> 
        </div>
      </div>`)

      }
      

  
      
      // close more-info button
      $(".More-Info").on("click", ".card > .btn-close", function(){
        console.log('hey')
        $('.More-Info').hide()
        $('.coins-container').show()


      })


      function getFiveCoins(shortList){
        let fiveCoinsReport = []
      $(".coins-container").on("click", ".switch > .toggle", function(e){
        if($(this).is(':checked')){
        const coinName = $(this).attr("data-toggle-id");
        console.log(coinName)
        fiveCoinsReport.push(coinName)
        $(".container-report").empty()
        renderToggleCoins(shortList,fiveCoinsReport)
        
        
     
     
      }
      else{
        const coinName = $(this).attr("data-toggle-id");
        var myIndex = fiveCoinsReport.indexOf(coinName)
        if(myIndex !== -1){

        fiveCoinsReport.splice(myIndex, 1)
        console.log(fiveCoinsReport)
        $(".container-report").empty()
        renderToggleCoins(shortList,fiveCoinsReport)
      }

      }
      

   
      if(fiveCoinsReport.length >  5){
        newWindowAlert(shortList, fiveCoinsReport)
        checkSelectCoins(shortList, fiveCoinsReport)
        console.log('hello')

      }


     

      })

    }
    
    $('.popUp').hide()

    function newWindowAlert(shortList, listOfNames){

      $('.coins-container').hide()
      $('.popUp').show()
      $('.popUp').append(`<div>
      <h2 class='popTitle'>Ooops!</h2>
      <p class='popP'>You can not select more than 5 coins...
      If you want to add more currency you need to Remove one currency in the list below:</p>
      </div>`)
      listOfNames.forEach((name) => {
        for(let i=0; i < shortList.length; i++){
          if(name === shortList[i].name){
            // console.log(shortList[i])
            $('.popUp').append(`<div class='chooseList'>${shortList[i].name}
            <div class='newToggle'><label class='switch'>
            <input class='toggle' data-toggle-name='${shortList[i].name}' type='checkbox' checked>
            <span class='slider round'></span>
          </label></div></div>

`)

          }

        }
        
        
      });
      $('.popUp').append(`<br><div class='saveBtn' >
      <button type="button" class="btn btn-secondary btn-sm">Cancel</button>
      <button type="button" class="btn btn-primary btn-sm">Save Coins</button>
      </div>

      `)
     


    }
    function checkSelectCoins(shortList,fiveCoinsReport){

    $(".popUp").on('click', '.switch > .toggle',function(e) {
      const coinName = $(this).attr("data-toggle-name");
      
      if($(this).is(':checked')){
        console.log(coinName)
        fiveCoinsReport.push(coinName)
      }  else{
        const coinName = $(this).attr("data-toggle-name");
        let myIndex = fiveCoinsReport.indexOf(coinName)
        if(myIndex !== -1){

        fiveCoinsReport.splice(myIndex, 1)
        console.log(fiveCoinsReport)
      }}

      $(".popUp").on("click",'.saveBtn > .btn-primary', function(){
        $(".container-report").empty()
        $(".coins-container").hide()
        $(".popUp").hide()
        $(".container-report").show()
        renderToggleCoins(shortList,fiveCoinsReport)
    
        
                
    
      })
            
      
    } )
  }
  function renderToggleCoins(shortList,fiveCoinsReport){
      fiveCoinsReport.forEach((name) => {
        for(let i=0; i < shortList.length; i++){
          if(name === shortList[i].name){
            // console.log(shortList[i])
            $(".container-report").append(`<div class='chooseList'>${shortList[i].name}

         </div>`)


          }
        }       
      });
      
              
  
    
  }






    })
  

     