<!--Hejsan kompisar. Här är koden så att vi får ut raise value. Imorgon kommer jag sitta för att räkna hur många värden det 

Nu läggs kort in här automatiskt. Finns ingen uträkning för hur mycket poäng man får än. 

-->

<template>
    <div>
      <!--<h1>{{labels.raiseValue}}</h1>-->
      <div class="wrapper1 raiseValuegrid">
        <div v-for="values in marketOrder" :key="values"  >
            <p class="valueSlot">{{values}} 
              <br>
            {{ cardCost(values)}}</p>          
          
            <div class="cardslots" v-for="(card, index) in raiseItems"  :key="index" >
                <div v-if="card.market==values" >
                     
                  <CollectorsCard
                      :card="card" 
                      :availableAction="card.available" 
                  />
                     
                </div>
                     
            </div>
           
        </div>      
    
      </div>

   </div> 
    
</template>
<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsRaiseValue',
  components: {
    CollectorsCard,

    
  },
  data: function(){
      return{
       marketOrder:["fastaval","figures","music","movie","technology"]
};

 },
 
  props: {
    labels: Object,
    player: Object,
    raiseItems: Array,
    raiseValue:Object
   
    
    
   
  },
  methods: {
    log(){
        console.log("hejsan "+this.raiseItems);

    },
    cardCost: function (values) {
       if(values=="fastaval"){
      return this.raiseValue.fastaval;

  }else if (values=="figures"){
    return this.raiseValue.figures;

  }else if(values=="music"){
    return this.raiseValue.music;

  }else if(values=="movie"){

    return this.raiseValue.movie;
  }else if(values=="technology"){
    return this.raiseValue.technology;

  }

  }
  }
   
  
}
//
//highlight last card from items and last card from auction pool and skill pool
// Highlight hand. 
// If click from hand then ad it to the market pool acording to the number of seals. 
// så vi behöver positions för dem. därför behöver vi in hit skicka med skillsONSale och AuctionOnSale. 
//
//
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.wrapper1{
  display: grid;
  grid-template-rows: repeat(auto-fill, 130px);
}
.raiseValuegrid{
  display:grid;
  grid-template-rows: 2.5vw 2.5vw 2.5vw 2.5vw 2.5vw;
  padding:1vw;
  justify-self:space-evenly;
  text-align:center;
  margin-bottom: 2vw;
}
.cardslots{
  display: grid;
  grid-row: 1;
  grid-template-rows: repeat(auto-fill, 0px);
  justify-items:center;
}
.valueSlot{
  color:black;
  background-color: #94b5ee;
  border-radius: 1vw;
  font-size: 0.8vw;
}
  
/*
  .available-to-choose {
    animation: jiggle 1s ease-in-out;
    animation-iteration-count:infinite;
    box-shadow: 0 0 10px yellow;
  }

  @keyframes jiggle {
    0% {transform:rotate(0.5deg);}
    50% {transform:rotate(-0.5deg);}
    100% {transform:rotate(0.5deg);}
  }
*/

</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
