<!--Hejsan kompisar. Här är koden så att vi får ut raise value. Imorgon kommer jag sitta för att räkna hur många värden det 

Nu läggs kort in här automatiskt. Finns ingen uträkning för hur mycket poäng man får än. 

-->

<template>
    <div>
      <h1>{{labels.raiseValue}}</h1>
      <div class="wrapper1">
     <div v-for="values in marketOrder" :key="values" class="raiseValues" >
            <p>{{values}} {{ cardCost(values)}}</p>
            
             {{ log() }}
             <div v-for="(card, index) in raiseItems"  :key="index" >
                 <div v-if="card.market==values" class="raiseValuesChild">
                
                     {{ log() }}
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
      console.log("hej "+this.raiseValue);
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .wrapper1{
    display: grid;
    grid-template-columns: repeat(auto-fill, 180px);
    margin-bottom: 250px;
    
  }
   
  .raiseValuesChild {

      display:grid;
      grid-template-rows: repeat(auto-fill, 50px);
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
