<template>
  <div>
    <div id="menuBtn">
      <div id="menuCircle"></div>
      <div id="menuImg"></div>
    </div>
    <div id="menuBar">
      <div class="menuIcon" id="menuHome"></div>
      <div class="menuIcon" id="menuTasks"></div>
      <div class="menuIcon" id="menuInfo"></div>
    </div>
  </div>
</template>
<style>
div#menuBtn {
  position: absolute;
  z-index: 200;

  border: none;
  text-align: center;
  cursor: move;
  width: 50px;
  height: 50px;
  top: 20px;
  left: 100px;
}

div#menuCircle {
  background-color: #444444;
  border-radius: 50%;
  opacity: 0.5;
  width: 50px;
  height: 50px;
}

div#menuImg {
  position: relative;
  top: -50px;
  width: 50px;
  height: 50px;
  background-image: url("../assets/menubtn.png");
  background-repeat: no-repeat;
  background-position: center;
  /*transform: rotate(180deg);*/
}

div#menuBar {
  position: absolute;
  z-index: 200;
  background-color: #444444;
  border: 2px solid #ffffff;
  border-radius: 5px;
  /*width: 150px;*/
  height: 50px;
  top: 100px;
  left: 100px;
  visibility: hidden;
  display: inline-block;
}
div.menuIcon {
  float: left;
  width: 50px;
  height: 50px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
div#menuHome {
  background-image: url("../assets/vulcanoweb.png");
}
div#menuTasks {
  background-image: url("../assets/tasksweb.png");
}
div#menuInfo {
  background-image: url("../assets/infoweb.png");
}
</style>
<script>
import $ from 'jquery';
import appData from '../modules/appData';

export default {
  name: "FloatingMenu",

  data: () => ({
    pos1: 0,
    pos2: 0,
    pos3: 0,
    pos4: 0,
    bodyWidth: 0,
    bodyHeight: 0,
    btnLeft: 0,
    btnTop: 0,
    preventClick: false,
    timeoutID: 0,
    elmnt: null,
    bar: null,
  }),
  methods: {
    testFunc: function() {
      console.log("test");
    },
    initMenu: function(elmnt,bar) {
      this.elmnt  = elmnt;
      this.bar = bar;
      this.bodyWidth = document.body.clientWidth;
      this.bodyHeight = document.body.clientHeight;
      this.btnLeft =  Number(appData.menuBtnLeft);
      this.btnTop =  Number(appData.menuBtnTop);
      
      this.positionMenuBtn();
      elmnt.onmousedown = this.dragMouseDown;
      elmnt.onclick = this.clickMenuBtn;
    },
    positionMenuBtn: function()  {
      let closeDrag = false;
        if (!this.btnTop || this.btnTop < 0) {
            this.btnTop = 0;
            closeDrag = true;
        }
        if (this.btnTop + this.elmnt.offsetHeight > this.bodyHeight) {
            this.btnTop = this.bodyHeight - this.elmnt.offsetHeight;
          closeDrag = true;
        }

        if (!this.btnLeft) {
            this.btnLeft = (this.bodyWidth / 2 ) - (this.elmnt.offsetWidth/2);
        }
        if (this.btnLeft < 0) {
          this.btnLeft = 0;
          closeDrag = true;
        }
        if (this.btnLeft + this.elmnt.offsetWidth > this.bodyWidth) {
            this.btnLeft = this.bodyWidth - this.elmnt.offsetWidth;
            closeDrag = true;
        }
        this.elmnt.style.top =  this.btnTop+ "px";
        this.elmnt.style.left = this.btnLeft + "px";
        this.positionMenuBar(this.btnLeft,this.btnTop);


        appData.menuBtnLeft = this.btnLeft;
        appData.menuBtnTop = this.btnTop;
        appData.commit();


        return closeDrag;
    },
    clickMenuBtn: function()  {
        console.log(window.location.hash);
        // if (window.location.hash.startsWith("#about")) {
        //     window.history.back();
        //     return;
        // }
        // let clickTime = performance.now();
        if (!this.preventClick) {

            if (this.bar.style.visibility != "visible") {
                // if (currentView!= null && currentView.viewName == "PlayerView" ) {
                //     $("#menuHome").show();
                //     $("#menuTasks").show();
                //     $( "#menuHome" ).click(function() {
                //         uxip.clickHome();
                //         bar.style.visibility = "hidden";
                //         clearTimeout(timeoutID);
                //     });
                //     $( "#menuTasks" ).click(function() {
                //         uxip.clickTasks();
                //         bar.style.visibility = "hidden";
                //         clearTimeout(timeoutID);
                //     });

                // } else {
                    $("#menuHome").hide();
                    $("#menuTasks").hide();
                // }
                let that = this;
                $( "#menuInfo" ).click(function() {
                    // window.location.hash = "about";
                    that.$router.push("/About");
                    that.bar.style.visibility = "hidden";
                    clearTimeout(that.timeoutID);
                });

                this.positionMenuBar(this.elmnt.offsetLeft,this.elmnt.offsetTop);
                this.bar.style.visibility = "visible";
                this.timeoutID = setTimeout(function(){
                    if (this.bar.style.visibility === "visible") {
                        this.bar.style.visibility = "hidden";
                    }
                 }, 7000);
            } else {
                this.bar.style.visibility = "hidden";
                clearTimeout(this.timeoutID);
            }
        }

    },
    dragMouseDown: function (e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      document.onmouseup = this.closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = this.elementDrag;
      this.preventClick = false;
    },

    elementDrag: function (e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      this.pos1 = this.pos3 - e.clientX;
      this.pos2 = this.pos4 - e.clientY;
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;
      // set the element's new position:

      this.btnTop = (this.elmnt.offsetTop - this.pos2);
      this.btnLeft = (this.elmnt.offsetLeft - this.pos1);
      let closeDrag = this.positionMenuBtn();
      if (closeDrag) {
          this.closeDragElement();
      }
      this.preventClick = true;

    },

    positionMenuBar: function (btnLeft,btnTop) {
        let left = btnLeft + (this.elmnt.offsetWidth / 2) - (this.bar.offsetWidth / 2);
        if (left < 0) {
            left = 0;
        }
        if (left + this.bar.offsetWidth > this.bodyWidth) {
          left = this.bodyWidth - this.bar.offsetWidth;
        }
        let top = btnTop - 56;
        if (top < 0) {
            top = btnTop + 56;
            this.elmnt.style.transform = 'rotate(180deg)';
        } else {
            this.elmnt.style.transform = '';
        }

        this.bar.style.top =  top+ "px";
        this.bar.style.left = left + "px";
    },

    closeDragElement: function () {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  },
  mounted: function() {
    console.log("FloatingMenu created..");
    let menuBtn = document.getElementById("menuBtn");
    let menuBar = document.getElementById("menuBar");
    console.log(`menuBtn: ${menuBtn}`);
    this.initMenu(
      menuBtn,
      menuBar
    );
    //this.testFunc();
  },
};
</script>
