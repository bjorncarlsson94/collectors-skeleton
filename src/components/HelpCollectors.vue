<template>
<div>
    <div class="InfoBox" id="skillsHelp" v-if="skillsHelpActive">
       <div><h3><strong>{{labels.skillsHelp.title}}</strong></h3>
      <p>{{labels.skillsHelp.intro}}</p></div>
      <div><h3><strong>{{labels.skillsHelp.titleArea}}</strong></h3>
      
      <p>{{labels.skillsHelp.skillsArea}}</p></div>
      <div><h3><strong>{{labels.skillsHelp.titleWorkerSkills}}</strong></h3>
      <img src='/images/Skills_work1.png' alt="funka ej">
      
      <p> {{labels.skillsHelp.nextTurn}}</p></div>
      <div><h3><strong>{{labels.skillsHelp.titleDrawCardSkill}}</strong></h3>
      <img src='/images/Skills_work2.png' alt="funka ej">
      
      <p>{{labels.skillsHelp.DrawCardSkill}}</p></div>
      <div><h3><strong>{{labels.skillsHelp.titleAuctionSkill}}</strong></h3>
      <img src='/images/Skills_auction.png' alt="funka ej">
      
      <p>{{labels.skillsHelp.auctionSkill}}</p></div>
      <div><h3><strong>{{labels.skillsHelp.titleGainWorker}}</strong></h3>
      <img src='/images/Skills_extraWorker.png' alt="funka ej">
      <p>{{labels.skillsHelp.gainWorker}}</p>
      </div>
      <div><h3><strong>{{labels.skillsHelp.titleVPSpecific}}</strong></h3>
      <img src='/images/Skills_VP.png' alt="funka ej">
      <p>{{labels.skillsHelp.VPSpecific}}</p>
      </div>
      <div><h3><strong>{{labels.skillsHelp.titleVPAll}}</strong></h3>
      <img src='/images/Skills_VP_all.png' alt="funka ej">
      
      <p>{{labels.skillsHelp.VPAll}}</p>
      </div>

    </div>
    <div class="InfoBox" id="workHelp" v-if="workHelpActive">
      <div><h3><strong>{{labels.itemsHelp.title}}</strong></h3>
      <p>{{labels.skillsHelp.intro}}</p></div>
      <div><h3><strong>Titel 2</strong></h3>
      <p> Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 3</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 4</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>titel 5</strong></h3>
      <p></p>
      <img src="https://previews.123rf.com/images/yupiramos/yupiramos1706/yupiramos170639117/81165835-cute-cat-cartoon-icon-vector-illustration-graphic-design.jpg" alt="funka ej">
      </div>

    </div>
    <div class="InfoBox" id="itemsHelp" v-if="itemsHelpActive">
      <div><h3><strong>{{labels.itemsHelp.title}}</strong></h3>
      <p>{{labels.skillsHelp.intro}}</p></div>
      <div><h3><strong>{{labels.itemsHelp.categoryTitle}}</strong></h3>
      <p> {{labels.itemsHelp.category}}</p></div>
      <div><h3><strong>{{labels.itemsHelp.costTitle}}</strong></h3>
      <p>{{labels.itemsHelp.cost}}</p></div>
      <div><h3><strong>{{labels.itemsHelp.extraActionsTitle}}</strong></h3>
       <p>{{labels.itemsHelp.extraActions}}</p>
      </div>

    </div>
    <div class="InfoBox" id="raiseValueHelp" v-if="raiseValueHelpActive">
      <div><h3><strong>Titel 1</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 2</strong></h3>
      <p> Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 3</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 4</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>titel 5</strong></h3>
      <p></p>
      <img src="https://previews.123rf.com/images/yupiramos/yupiramos1706/yupiramos170639117/81165835-cute-cat-cartoon-icon-vector-illustration-graphic-design.jpg" alt="funka ej">
      </div>

    </div>
    <div class="InfoBox" id="buttonsHelp" v-if="buttonsHelpActive">
      <div><h3><strong>Titel 1</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 2</strong></h3>
      <p> Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 3</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 4</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>titel 5</strong></h3>
      <p></p>
      <img src="https://previews.123rf.com/images/yupiramos/yupiramos1706/yupiramos170639117/81165835-cute-cat-cartoon-icon-vector-illustration-graphic-design.jpg" alt="funka ej">
      </div>

    </div>
    <div class="InfoBox" id="menuSpaceHelp" v-if="menuSpaceActive">
      <div><h3><strong>Titel 1</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 2</strong></h3>
      <p> Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 3</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>Titel 4</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p></div>
      <div><h3><strong>titel 5</strong></h3>
      <p></p>
      <img src="https://previews.123rf.com/images/yupiramos/yupiramos1706/yupiramos170639117/81165835-cute-cat-cartoon-icon-vector-illustration-graphic-design.jpg" alt="funka ej">
      </div>

    </div>
     <div class="InfoBox" id="auctionHelp" v-if="auctionHelpActive">
      <div><h3><strong>Titel 1</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p>
      </div>
      <div><h3><strong>Titel 2</strong></h3>
      <p> Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p>
      </div>
      <div><h3><strong>Titel 3</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p>
      </div>
      <div><h3><strong>Titel 4</strong></h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi tellus, posuere id neque ut, venenatis facilisis velit. Donec fringilla tellus non neque pretium, vel fermentum tortor maximus. Mauris gravida molestie est ac imperdiet. Etiam vestibulum</p>
      </div>
      <div><h3><strong>titel 5</strong></h3>
      <p>aa</p>
      <img src="https://previews.123rf.com/images/yupiramos/yupiramos1706/yupiramos170639117/81165835-cute-cat-cartoon-icon-vector-illustration-graphic-design.jpg" alt="funka ej">
      </div>
     
     </div>
 </div>

</template>

<script>
export default {
  name: 'HelpCollectors',
  components: {
    

  },
  props:{
    labels: Object,
    player: Object,
    players: Object,
    helpAction: Boolean,
      skillsHelpActive:Boolean,
      auctionHelpActive:Boolean,
      menuSpaceActive:Boolean,
      buttonsHelpActive:Boolean,
      workHelpActive:Boolean,
      itemsHelpActive:Boolean,
      raiseValueHelpActive:Boolean,

  },
}
 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .InfoBox{
   --scrollbarBG: #b1c592;
  --thumbBG: #5b7563;
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
  
  border-radius: 1vw;
  -webkit-box-shadow: 0px 0px 3px 2px rgba(102, 163, 255, 0.59);
  box-shadow: 0px 0px 3px 2px rgba(102, 163, 255, 0.59);
  background-color: inherit;
  padding: 1vw;
  
  max-width: 19.791666666666668vw;
  min-width: 14vw;
  max-height: 43.833333333333332vw;
  overflow-y: auto;
  position: absolute;
  z-index: 6;
  word-wrap: break-word;
  display: inline;
  font-size: 1vw;
  left: -100px;
  width: 5.208vvw;
  height: 30vw;
  background: #b1c592;
 
}
.InfoBox h3 {
  background-color: #9aac80af;
  border-radius: 0.5vw;
  padding: 0.55vw;

  border: solid;
  border-width: 0.2px;
  border-color: black;
}
.InfoBox p {
  background-color: #a4b48d;
  border-radius: 0.5vw;
  margin-top: -0.52vw;
  padding: 0.55vw;
  border: solid;
  border-width: 0.2px;
  border-color: black;
}
.InfoBox div {
  border-radius: 0.5vw;
  background-color: #767e6b;
  padding: 5px;
  margin-bottom: 2px;
  border: solid;
  border-width: 0.2px;
  border-color: black;
}
.InfoBox img {
  border-radius:0.5vw;
  padding: 1px;
  height: 100px;
  width: 100px;
  border: solid;
  border-width: 0.2px;
  border-color: black;
}


.InfoBox::-webkit-scrollbar {
  width: 11px;
  height: 10px;
}

.InfoBox::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
  margin: 20px;
 
}
.InfoBox::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 6px;
  border: 3px solid var(--scrollbarBG);
}
#skillsHelp{
 -webkit-animation: skillSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: skillSlide 0.5s forwards;
  animation-delay: 0.01;
  
}
#skillsHelp img{
 float:right;
 margin-top: -60px;
 width: 50px;
 height: 50px;
}

#workHelp{
  -webkit-animation: workSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: workSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #7b7a7a;
    --scrollbarBG: #7b7a7a;
  --thumbBG: #3a3837;
}
#workHelp div{

  background-color: #5c5858;

}
#workHelp h3{

  background-color: #7b7a7a;

}
#workHelp p{
  background-color: #7b7a7a;

}
#raiseValueHelp{
  -webkit-animation: raiseValueSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: raiseValueSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #acabca;
  --scrollbarBG: #abb7ca;
  --thumbBG: #5b6475;

}
#raiseValueHelp div{

  background-color: #7791bb;

}
#raiseValueHelp h3{

  background-color: #acabca;

}
#raiseValueHelp p{
  background-color: #acabca;

}
#menuSpaceHelp{
 -webkit-animation: menuSpaceSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: menuSpaceSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #9a9494;
}
#auctionHelp{
 -webkit-animation: auctionSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: auctionSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #7b7a7a;
}
#itemsHelp{
  -webkit-animation: itemsSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: itemsSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #ecadab;
  --scrollbarBG: #ecadab;
  --thumbBG: #755c5b;

}
#itemsHelp div{

  background-color: #b47573;

}
#itemsHelp h3{

  background-color: #ecadabd3;

}
#itemsHelp p{
  background-color: #ecadabd3;

}

#buttonsHelp{
  -webkit-animation: buttonsSlide 1.5s forwards;
  -webkit-animation-delay: 0.01s;
  animation: buttonsSlide 0.5s forwards;
  animation-delay: 0.01;
  background-color: #fafbf0;
}

  
  @-webkit-keyframes skillSlide {
    0%{left: 0%;}
    0%{top: 10%;}
    
    100% { left: 16%; }
    100% { top: 10%; }
}

@keyframes skillSlide {
  0%{left: 0%;}
    0%{top: 10%;}
   
    100% { left: 16%; }
    100% { top: 10%; }
}
 @-webkit-keyframes workSlide {
    0%{left: 0%;}
    0%{top: 14%;}
    
    100% { left: 25%; }
    100% { top: 14%; }
}

@keyframes workSlide {
  0%{left: 0%;}
    0%{top:14%}
   
    100% { left: 25%; }
    100% { top: 14%; }
}
 @-webkit-keyframes raiseValueSlide {
    0%{left: 0%;}
    0%{top: 14%;}
    
    100% { left: 58%; }
    100% { top: 14%; }
}

@keyframes raiseValueSlide {
  0%{left: 0%;}
    0%{top:14%}
   
    100% { left: 58%; }
    100% { top: 14%; }
}
 @-webkit-keyframes itemsSlide {
    0%{left: 0%;}
    0%{top: 14%;}
    
    100% { left: 16%; }
    100% { top: 14%; }
}

@keyframes itemsSlide {
  0%{left: 0%;}
    0%{top:14%}
   
    100% { left: 16%; }
    100% { top: 14%; }
}
 @-webkit-keyframes buttonsSlide {
    0%{left: 0%;}
    0%{top: 14%;}
    
    100% { left: 58%; }
    100% { top: 14%; }
}

@keyframes buttonsSlide {
  0%{left: 0%;}
    0%{top:14%}
   
    100% { left: 58%; }
    100% { top: 14%; }
}
 @-webkit-keyframes menuSpaceSlide {
    0%{left: 0%;}
    0%{top: 10%;}
    
    100% { left: 12%; }
    100% { top: 10%; }
}

@keyframes menuSpaceSlide {
  0%{left: 0%;}
    0%{top:10%}
   
    100% { left: 12%; }
    100% { top: 10%; }
}
 @-webkit-keyframes auctionSlide {
    0%{left: 0%;}
    0%{top: 14%;}
    
    100% { left: 2%; }
    100% { top: 14%; }
}

@keyframes auctionSlide {
  0%{left: 0%;}
    0%{top:14%}
   
    100% { left: 2%; }
    100% { top: 14%; }
}


</style>
