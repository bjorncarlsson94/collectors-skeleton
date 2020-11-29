<template>
    <div v-if="card.x>0" :class="['card', {'available-to-choose': availableAction}]" :style="{'background-position': (-(card.x-1)*250)+'px ' + (-(card.y-1)*350)+'px'}" @click="doAction">

      {{card.item}} 
      {{card.skill}}
      {{card.market}}
    </div>
</template>

<script>
export default {
  name: 'CollectorsCard',
  props: {
    card: Object,
    availableAction: Boolean
  },
  methods: {
    doAction: function() {
      this.$emit('doAction');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    color:red;
    user-select: none;
    width:250px;
    height:350px;
    background-image: url('/images/collectors-cards.png');
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
