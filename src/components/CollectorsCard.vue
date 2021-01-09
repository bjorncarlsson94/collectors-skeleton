<template>

    <div v-if="card.x>0" :class="['card', {'available-to-choose': availableAction}]" 
      :style="{'zoom':scalefactor,'background-position': (-(card.x-1)*250)+'px ' + (-(card.y-1)*317)+'px'}" @click="doAction"> 
    </div>
</template>

<script>
export default {
  name: 'CollectorsCard',
  data: function() {
    return{
      scalefactor: window.innerWidth/5000   // Här dyker en skalning upp - det är faktiskt här och inte i collectors.vue som det sker. Se även ovan där kortens koordinater bestäms.
    }
  },
  props: {
    card: Object,
    availableAction: Boolean
  },
  methods: {
    doAction: function() {
      this.$emit('doAction');
    }
  },
  mounted() {
  window.addEventListener('resize', () => {
    this.scalefactor = window.innerWidth/5000
    })
  },
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


</style>
