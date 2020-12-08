<template>
    <div>
      <h1>{{labels.raiseValue}}</h1>
      <div class="wrapper1">
     <div v-for="values in marketOrder" :key="values" class="raiseValues" >
            <p>{{values}}</p>
            
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
       marketOrder:["fastival","figures","music","movie","technology"]
};

 },
 
  props: {
    labels: Object,
    player: Object,
    raiseItems: Array,
   
    
    
   
  },
  methods: {
    log(){
        console.log("hej "+this.raiseItems);

    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .wrapper1{
    display: grid;
    grid-template-columns: repeat(auto-fill, 317px);
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
