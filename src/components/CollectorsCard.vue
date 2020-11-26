<template>
    <div class="card" :style="{'background-position': (-(card.x-1)*250)+'px ' + (-(card.y-1)*317)+'px'}">

      {{card.item}} 
      {{card.skill}}
      {{card.market}}
    </div>
</template>

<script>
export default {
  name: 'CollectorsCard',
  props: {
    card: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    color:red;
    user-select: none;
    width:250px;
    height:317px;
    background-image: url('/images/collectors-cards-new.png');  
    border-radius: 10px;
  }

</style>
