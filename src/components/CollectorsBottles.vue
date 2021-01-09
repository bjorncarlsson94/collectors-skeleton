<template>
  <div>
    <div class="placeBottlesPlayer" v-show="endRound">
        <button class="bottlebuttons" :disabled="ifBottlesCanBePlaced()" @click="placeBottlePlayerbord()">Done</button>
        <div class="bottlesText">lorem ipsum</div>
        <div class="bottlesLeft" v-if="players[playerId].totalBottles > 2">{{amountOfBottlesThatCanBePlaced()}}x</div>
        <div class="bottles L"></div>
      <img src="/images/bottle-playerboard.png" class="bottleOptions">
      <!-- <div class="bottlesGrid" v-for="(bottlePlace, index) in tempBottlePlacement" :key="index">
          <div class="bottleButton A"  @click="changeTempBottle(0) && ifBottlesCanBePlaced()">
            <div class="bottles" v-show="tempBottlePlacement[0]">
              {{bottlePlace}}
            </div>
          </div> -->
          <div class="bottleButton A">
            <div class="bottles A" :style="{backgroundColor: players[playerId].color}" v-show="tempBottlePlacement[0]">
            </div>
          </div> 
           <div class="bottleButton B">
            <div class="bottles B" :style="{backgroundColor: players[playerId].color}" v-show="tempBottlePlacement[1]">
            </div>
          </div>
           <div class="bottleButton C"  @click="dispBottle(2)">
            <div class="bottles C" :style="{backgroundColor: players[playerId].color}" v-show="tempBottlePlacement1">
            </div>
          </div>
           <div class="bottleButton D"  @click="dispBottle(3)">
            <div class="bottles D" :style="{backgroundColor: players[playerId].color}" v-show="tempBottlePlacement2">
            </div>
          </div>
           <div class="bottleButton E" @click="dispBottle(4)">
            <div class="bottles E" :style="{backgroundColor: players[playerId].color}" v-show="tempBottlePlacement3">
            <!-- </div> -->
          </div>
      </div>
    </div> 
  </div>
</template>
<script>

export default {
  name: "CollectorsBottles",
  props: {
    endRound: Boolean,
    players: Object,
    labels: Object,
    playerId: String,
    tempBottlePlacement: Array,
    changeTempBottle: Function,
    placeBottleOnPlayerboard: Function,
  },
   data: function () {
       return {
         tempBottlePlacement1: false,
         tempBottlePlacement2: false,
         tempBottlePlacement3: false,
         bottlePlaced: 0,
     };
   },

  methods: {
    dispBottle: function(index) {
      if(this.ifBottlesCanBePlaced()){
        this.changeTempBottle(index);
        if (index == 2){
          this.tempBottlePlacement1 = true;
        }
        else if (index == 3){
          this.tempBottlePlacement2 = true;
        }
        else if (index == 4){
          this.tempBottlePlacement3 = true;
        }
        this.ifBottlesCanBePlaced();
      }
    },
    amountOfBottlesThatCanBePlaced() {
      let amount = 0;
      for (let i = 0; i < this.tempBottlePlacement.length; i += 1) {
        if (this.tempBottlePlacement[i] == true){
          amount++;
        }
      }
      return this.players[this.playerId].bottles - amount
    },
    ifBottlesCanBePlaced: function() {
      let amount = 0;
      for (let i = 0; i < this.tempBottlePlacement.length; i += 1) {
        if (this.tempBottlePlacement[i] == true){
          amount++;
        }
      }
      if(amount < this.players[this.playerId].bottles){
          return true;
      }
      else{
          return false;
      }
    },
    placeBottlePlayerbord: function(){
      this.tempBottlePlacement1 = false;
      this.tempBottlePlacement2 = false;
      this.tempBottlePlacement3 = false;
      this.placeBottleOnPlayerboard();
    }
  },
};
</script>
 <style>
.placeBottlesPlayer {
  display: grid;
  position: absolute;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: 40vw;
  height: 18vw;
  background-color: gainsboro;
  border-radius: 2vw;
  border-style: solid;
  border-width: 0.4vw;
  border-color: black;
  z-index: 50;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1vw;
}
.bottleOptions{
   left: 1vw;
   grid-row: 2;
   width: 40vw;
   position: absolute;
}
.bottles{
background-image: url(/images/player-bottle.png);
    margin-top: 0.8vw;
    height: 6vw;
    width: 6vw;
    background-color: rgb(95, 216, 253);
    border-radius: 4vw;
    z-index: 60;
    border-style: ridge;
    box-shadow: 0.1vw 0.1vw rgba(0, 0, 0, 0.692);
    border-width: 0.2vw;
    border-color: rgba(77, 58, 58, 0.658);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin-left: 0.8vw;
}
.bottlesText{
  color:black;
}
.bottlesLeft{
  color: black;
    grid-row: 1;
    grid-column: 4;
    text-align: right;
    font-size: 3.5vw;
    margin-top: 2.5vw
}
.bottlebuttons:disabled {
  background-color: grey;
  cursor: default;
}
.bottlebuttons {
  cursor: pointer;
    display: inline-block;
    color: black;
    font-size: 1.5vw;
    margin: 1.4vw;
    background-color: lawngreen;
    border-radius: 2vw;
    box-shadow: 0.2vw 0.3vw #999;
}
.bottlesGrid{
  color: black; 
  z-index: 55; 
}
.bottleButton{
    height: 7vw;
    width: 7.5vw;
    cursor: pointer;
    z-index: 55;
}
.bottlesButtonGrid{
    grid-row-start: 2;
}
.bottleButtonFin{
    color:black;
}
.A{
  grid-column: 1;
}
.B{
  grid-column: 2;
}
.C{
  grid-column: 3;
}
.D{
  grid-column: 4;
}
.E{
  grid-column: 5;
}
.L{
  grid-column: 5;
  grid-row: 1;
}
</style>