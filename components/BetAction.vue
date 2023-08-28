<template>
    <div className="mainContainer" v-bind:style="{ 'position': 'relative', 'max-width': '100%' }">
        <div class="selectionButtons">
            <div class="manualAuto">
                <button class="filter-button" v-bind:class="{ selected: isSelectedManual,playing: isPlaying}" @click="ShowManual()" v-bind:style="{ 'z-index': 9999999999 }"
                    ref="showManual">
                    Manual
                </button>
                <button class="filter-button"  v-bind:class="{ selected:isSelectedAutoBet,playing: isPlaying}"  @click="ShowAutomatic()" ref="ShowAutomatic"
                    v-bind:style="{ 'z-index': 9999999999 }">
                    Automatic
                </button>
            </div>
            <div className="manualSection" v-bind:style="{ 'display': displayManual }">
                <div class="inputFormat">
                    <span class="InputTextLabel">Bet amount:</span>
                    <div >
                        <div >
                            <CurrencyDollarSimple weight="bold" />
                        </div>
                    </div>
                    <div >
                        <input class="InputTextVal" type="number" v-model="count" ref="countManual" 
                            style="" />
                        <button @click="halfDivide()" class="sideButton" ref="halfDivide" >
                            ½
                        </button>
                        <button @click="double()" class="sideButton" ref="double" >
                            2x
                        </button>
                        <button ref="max" class="sideButton" >
                            max
                        </button>
                    </div>
                </div>
                <div class="inputFormat">
                    <span class="InputTextLabel">Lines:</span>
                    <select class="InputTextVal" defaultValue="{16}" ref="lineSelect" style="Color: #fff;"
                        id="lines" @change="ChangeLine">
                        <!-- {linesOptions.map(line => ( -->
                        <option key="{line}" value=16>16 Line</option>
                        <option key="{line}" value=15>15 Line</option>
                        <option key="{line}" value=14>14 Line</option>
                        <option key="{line}" value=13>13 Line</option>
                        <option key="{line}" value=12>12 Line</option>
                        <option key="{line}" value=11>11 Line</option>
                        <option key="{line}" value=10>10 Line</option>
                        <option key="{line}" value=9>9 Line</option>
                        <option key="{line}" value=8>8 Line</option>
                        <!-- ))} -->
                    </select>
                </div>
                <div class="inputFormat">
                    <span class="InputTextLabel">Risk:</span>
                    <select class="InputTextVal" defaultValue="{high}" ref="riskSelect"  style="color: #fff;"
                        id="lines">
                        <!-- {linesOptions.map(line => ( -->
                        <option value=high>High Risk</option>
                        <option value=medium>Medium Risk</option>
                        <option value=low>Low Risk</option>

                        <!-- ))} -->
                    </select>
                </div>
                <div style="margin-top: 30px;">
                    <a @click="DecodeInputData()" class="betbutton" href="#" rel="noopener noreferrer"
                        tag="a"><!--[-->Bet<!--]--></a>
                </div>
            </div>
            <div className="autoBetSection" v-bind:style="{ 'display': displayAutomatic }">
                <div class="inputFormat">
                    <span class="InputTextLabel">Bet amount:</span>
                    <div >
                        <div >
                            <CurrencyDollarSimple weight="bold" />
                        </div>
                    </div>
                    <div >
                        <input class="InputTextVal" type="number" v-model="count" ref="countAutoplay"
                            style="" />
                        <button @click="halfDivide()" ref="halfDivideAutoplay" class="sideButton">
                            ½
                        </button>
                        <button @click="double()" ref="doubleAutoplay" class="sideButton">
                            2x
                        </button>
                        <button ref="doubleMax" class="sideButton">
                            max
                        </button>
                    </div>
                </div>
                <div class="inputFormat">
                    <span class="InputTextLabel">Lines:</span>
                    <select class="InputTextVal" defaultValue="{16}" ref="lineSelectAutoplay" style="color: #fff;"
                        id="lines" @change="ChangeLine">
                        <!-- {linesOptions.map(line => ( -->
                        <option key="{line}" value=16>16 Line</option>
                        <option key="{line}" value=15>15 Line</option>
                        <option key="{line}" value=14>14 Line</option>
                        <option key="{line}" value=13>13 Line</option>
                        <option key="{line}" value=12>12 Line</option>
                        <option key="{line}" value=11>11 Line</option>
                        <option key="{line}" value=10>10 Line</option>
                        <option key="{line}" value=9>9 Line</option>
                        <!-- ))} -->
                    </select>
                </div>
                <div class="inputFormat">
                    <span class="InputTextLabel">Risk:</span>
                    <select class="InputTextVal" defaultValue="{high}" ref="riskSelectAutoplay"  style="color: #fff;"
                        id="lines">
                        <!-- {linesOptions.map(line => ( -->
                        <option value=high>High Risk</option>
                        <option value=medium>Medium Risk</option>
                        <option value=low>Low Risk</option>

                        <!-- ))} -->
                    </select>
                </div>
                <div class="inputFormat">
                    <p class="InputTextLabel"># of Bets</p>
                    <input class="InputTextVal" ref="numberOfBets" type="number" @input="ChangeNumberOfDropBalls"
                        v-model="numberOfBallsAutoPlay" style="color:#fff;" />
                </div>
                <div style="margin-top: 30px;">
                    <a @click="DecodeInputDataAutoplay()" class="betbutton" v-bind:class="{playing: isPlayingAutoplay}" ref="clickButton" href="#" rel="noopener noreferrer"
                        tag="a"><!--[-->Start AutoBet<!--]--></a>
                </div>
            </div>
        </div>


        <div class="plinkoGameContainer" v-bind:style="{ 'max-width': '100%' }">
            <div id="plinko" ref="plinkoDiv" v-bind:style="{ 'width': '800px', 'max-width': '100%' }">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import positionPathArr from "@/assets/json/pathArr.json";
import inputValues from "@/assets/json/input.json";

const SCENE_SCALE = 1.5;

export default {
    data() {
        return {
            worldWidth: 800,
            startPins: 3,
            numberOfBallsAutoPlay: 0,
            isPlaying: false,
            isPlayingAutoplay: false,
            isSelectedManual: true,
            isSelectedAutoBet: false,
            pinLines: 14,
            displayManual: "block",
            displayAutomatic: "none",
            pinSize: 1 * SCENE_SCALE,
            pinGap: 15 * SCENE_SCALE,
            ballSize: 4 * SCENE_SCALE,
            ballElastity: 1,
            engine: null,
            world: null,
            pins: [],
            lines: [],
            balls: []
        };
    },

    setup(props) { },

    methods: {

        ShowAutomatic() {
            this.isSelectedManual = false;
            this.isSelectedAutoBet = true;
            this.displayManual = "none";
            this.displayAutomatic = "block";
        },
        ShowManual() {
            this.isSelectedManual = true;
            this.isSelectedAutoBet = false;
            this.displayManual = "block";
            this.displayAutomatic = "none";
        },
        /**
         * Create the pins for our environment according to the number of rows
         * @param index the game index
         */
        setEnvironmentAccordingToSimulation(index) {
            this.destroyed = false;
            this.ballsDropped = 0;
            this.lastIndex = 0;
            this.ballPositions = [];
            this.dropBallsArr = [];
            this.numberOfrow = 8 + index;
            this.numberOfColsInitial = 3;
            this.ballDistance = 512 / this.numberOfrow;
            this.ballSize = 7 + (16 - this.numberOfrow) / 2.5;
            this.ballSizeEnv = 5 + (16 - this.numberOfrow) / 2.5;
            this.createEnvironmentBlocks(this.numberOfrow, this.numberOfColsInitial);
            // this.DecodeInputData();
        },
        /**
         * set the game index according to the selected number of lines
         * @param e event on click
         */
        ChangeLine(e) {
            if (e.target.options.selectedIndex > -1) {
                this.currentGameIndex = Number(e.target.options[e.target.options.selectedIndex]._value) - 8;
            }
            this.destroyAllAndCreateNew();
            // this.setEnvironmentAccordingToSimulation(this.currentGameIndex);
        },
        ChangeNumberOfDropBalls(e) {
            this.numberOfBallsAutoPlay = e.target.value;
        },

        ChangeMode(e) {
            this.numberOfBallsAutoPlay = e.target.value;
        },
        DecodeInputDataAutoplay() {
            if (this.autoplayStarted) {
                this.StopAutoPlay();
            }
            else if (this.numberOfBallsAutoPlay > 0) {
                this.isPlaying=true;
                this.isPlayingAutoplay=false;
                this.$refs["clickButton"].innerHTML = "Stop Autoplay";
                this.autoplayStarted = true;
                this.disableAllInputs();
                let currentConfiguration = this.configurationData[this.currentGameIndex];
                let numberOfBalls = this.numberOfBallsAutoPlay;
                let finalPosArr = [];
                for (let i = 0; i < numberOfBalls; i++) {
                    finalPosArr.push(Math.floor(Math.random() * (this.currentGameIndex + 9)));
                }
                let ctr = 0;
                let xPosArr = [];
                let index = 0;
                for (let i = 0; i < numberOfBalls; i++) {
                    let reqConfig = currentConfiguration[finalPosArr[i]];
                    let inputIndex = Math.floor(Math.random() * reqConfig.length);
                    xPosArr.push(reqConfig[inputIndex]);
                    ctr++;
                }
                this.ballDropInterval = setInterval(() => {
                    if(inputCounter>=this.inputValues){
                        inputCounter=0;
                    }
                    let input = this.inputValues[this.inputCounter++]
                    let finalMultiplier = input.payoutMultiplier;
                    let finalPos = 0;
                    if(this.multiplierValues[this.currentGameIndex].includes(finalMultiplier)){
                        this.multiplierValues[this.currentGameIndex].indexOf(finalMultiplier);
                    }
                    else{
                        finalPos = 7;
                    }
                    let currentConfiguration = this.configurationData[this.currentGameIndex];
                    let reqConfig = currentConfiguration[finalPos];
                    let inputIndex = Math.floor(Math.random() * reqConfig.length);
                    this.createdropBall(this.lastIndex, reqConfig[inputIndex], finalPos);
                    index++;
                    this.numberOfBallsAutoPlay--;
                    this.lastIndex++;
                    if (index == numberOfBalls) {
                        // this.autoplayStarted = false;
                        clearInterval(this.ballDropInterval);
                        // this.$refs["clickButton"].innerHTML = "Start AutoBet";
                    }
                }, 1500, this);
            }
        },

        StopAutoPlay() {
            this.$refs["clickButton"].innerHTML = "Start AutoBet";
            this.isPlayingAutoplay=true;
            clearInterval(this.ballDropInterval);
        },


        /**
         * set the final point of the ball before dropping
         */
        DecodeInputData() {
            this.disableAllInputsManual();
            if(inputCounter>=this.inputValues){
                inputCounter=0;
            }
            let input = this.inputValues[this.inputCounter++]
            let finalMultiplier = input.payoutMultiplier;
            if(this.multiplierValues[this.currentGameIndex].includes(finalMultiplier)){
                let finalPos = this.multiplierValues[this.currentGameIndex].indexOf(finalMultiplier);
                let currentConfiguration = this.configurationData[this.currentGameIndex];
                let reqConfig = currentConfiguration[finalPos];
                let inputIndex = Math.floor(Math.random() * reqConfig.length);
                this.createdropBall(this.lastIndex, reqConfig[inputIndex], finalPos);
                this.lastIndex++;
            }
        },
        /**
         * change the ball position according to the position of its body which is following the physics of the body
         */
        updatePos() {
            this.dropBallsArr.forEach((ball, index) => {
                if(ball.visible && ball.positionIndex<ball.positionArray.length){
                    ball.position.x = ball.positionArray[ball.positionIndex].x;
                    ball.position.y = ball.positionArray[ball.positionIndex++].y;
                }
                if(ball.positionIndex>=ball.positionArray.length && ball.visible){
                    this.ballsDropped++;
                    ball.visible = false;
                    let finalIndex = Math.floor((ball.position.x - this.ballPositions[this.numberOfrow - 1][0].x) / this.ballDistance);
                    this.animateBottomMultiplier(ball, ball.finalPoint);
                }
                // if (ball.position.y > this.bottomMultiplier[0].y - 20 && ball.visible) {
                    
                // }
            });
        },
        /**
         * after the balls drops on the multiplier we animate a bounce animation for the multiplier
         * @param ball the ball that falls
         * @param index the index of the multiplier where it falls
         */
        animateBottomMultiplier(ball, index) {
            this.historyArr.push(this.multiplierText[index]);
            this.startMovingMultiplier();
            let _this = this;
            if (index < 0) {
                index = 0;
            }
            if (index > this.numberOfrow) {
                index = this.numberOfrow;
            }
            let animatedObj1 = this.bottomMultiplier[index];
            let animatedObj2 = this.multiplierText[index];
            animatedObj1.position.set(this.ballPositions[this.numberOfrow][index].x + this.ballDistance / 2 + this.ballSizeEnv + 2, this.ballPositions[this.numberOfrow][index].y - this.ballDistance / 2);
            animatedObj2.position.set(this.ballPositions[this.numberOfrow][index].x + this.ballDistance + this.ballSizeEnv - 5, this.ballPositions[this.numberOfrow][index].y - this.ballDistance / 2 + 7.5);

            let yPos1 = animatedObj1.y;
            let yPos2 = animatedObj2.y;

            let tween1 = gsap.to(animatedObj1.position, {
                duration: 0.2,
                x: animatedObj1.x,
                y: yPos1 + 10
            });
            tween1.play();
            tween1.eventCallback("onComplete", () => {
                let tween2 = gsap.to(animatedObj1.position, {
                    duration: 0.2,
                    x: animatedObj1.x,
                    y: yPos1
                });
                tween2.play();
            }, [], this);
            let tween3 = gsap.to(animatedObj2.position, {
                duration: 0.2,
                x: animatedObj2.x,
                y: yPos2 + 10
            });
            tween3.play();
            tween3.eventCallback("onComplete", () => {
                let tween4 = gsap.to(animatedObj2.position, {
                    duration: 0.2,
                    x: animatedObj2.x,
                    y: yPos2
                });
                tween4.play();
                tween4.eventCallback("onComplete", () => {
                    if (this.ballsDropped === _this.lastIndex && this.destroyed === false) {
                        //   _this.destroyAllAndCreateNew();
                        if(_this.isSelectedManual){
                            _this.enableAllInputsManual();
                        }
                        else{
                            _this.enableAllInputs();
                        }
                    }
                });
            }, [], this);
        },
        /** 
         * the function generate the multipliers as per the game index or number of rows
        */
        createBottomMultiplier() {
            this.bottomMultiplier = [];
            this.multiplierText = [];
            for (let i = 0; i <= this.numberOfrow; i++) {
                this.bottomMultiplier[i] = new PIXI.Graphics();
                this.bottomMultiplier[i].resolution=3;
                this.bottomMultiplier[i].beginFill(0x313644, 1).drawRoundedRect(0, 0, this.ballDistance - 3, 30, 10);
                this.bottomMultiplier[i].position.set(this.ballPositions[this.numberOfrow][i].x + this.ballDistance / 2 + this.ballSizeEnv + 2, this.ballPositions[this.numberOfrow][i].y - this.ballDistance / 2);
                this.bottomMultiplier[i].pivot.set(this.ballSizeEnv, this.ballSizeEnv);
                this.multiplierText[i] = new PIXI.Text("", {
                    fontSize: 12,
                    align: "right",
                    lineHeight: 30,
                    wordWrapWidth: this.ballDistance,
                    fill: ['#ffffff']
                });
                this.multiplierText[i].resolution = 2;
                console.log(this.multiplierText[i].width);

                this.multiplierText[i].text = this.multiplierValues[this.currentGameIndex][i];
                if(this.multiplierValues[this.currentGameIndex][i].toString().length<=2){
                    this.multiplierText[i].text+="x";
                }
                this.multiplierText[i].anchor.set(0.5);

                this.multiplierText[i].position.set(this.ballPositions[this.numberOfrow][i].x + this.ballDistance + this.ballSizeEnv - 5, this.ballPositions[this.numberOfrow][i].y - this.ballDistance / 2 + 7.5);
                this.mainContainer.addChild(this.bottomMultiplier[i]);
                this.mainContainer.addChild(this.multiplierText[i]);
            }
        },
        /**
         * this function create the pins and adds bodies to those pins so that they interact with the ball physically
         * @param numberRows the number of row
         * @param starterColumns the number of columns in the tops 
         */
        createEnvironmentBlocks(numberRows, starterColumns) {
            this.cbbodies = [];
            this.ballPositions = [];
            let cols = starterColumns;
            let i = 0
            for (i = 0; i < numberRows; i++) {
                this.cbbodies[i] = [];
                this.ballPositions[i] = [];
                for (let j = 0; j < cols; j++) {
                    let offset = ((numberRows - i) * this.ballDistance) / 2;
                    let x = offset + this.ballDistance * j;
                    let y = i * this.ballDistance;
                    this.ballPositions[i][j] = { x: x, y: y };

                    this.cbbodies[i].push(new PIXI.Graphics());
                    this.cbbodies[i].resolution=3;
                    this.cbbodies[i][j].beginFill(0xffffff, 1).drawCircle(0, 0, this.ballSizeEnv).endFill();
                    this.cbbodies[i][j].position.set(x, y);
                    this.mainContainer.addChild(this.cbbodies[i][j]);
                }
                cols++;
            }
            this.ballPositions[i] = [];
            for (let j = 0; j < cols; j++) {
                let offset = ((numberRows - i) * this.ballDistance) / 2;
                let x = offset + this.ballDistance * j;
                let y = i * this.ballDistance;
                this.ballPositions[i][j] = { x: x, y: y };
            }
            this.createBottomMultiplier();
            this.resize();
        },
        /**
         * this function create a ball and assigns it its initial drop position
         * @param i the counter of the ball being dropped 
         * @param xPos the initial x-axis position of the ball 
         */
        createdropBall(i, positionArray, finalPoint) {
            let x = this.ballPositions[0][1].x;
            let y = this.ballPositions[0][1].y;
            this.dropBallsArr.push(new PIXI.Graphics());
            this.dropBallsArr.resolution = 3;
            this.dropBallsArr[i].beginFill(0xff0000, 1).drawCircle(0, 0, this.ballSize).endFill();
            this.mainContainer.addChild(this.dropBallsArr[i]);
            this.dropBallsArr[i].x = 0;
            this.dropBallsArr[i].finalPoint = finalPoint;
            this.dropBallsArr[i].indexPos = i;
            this.dropBallsArr[i].positionIndex = 0;
            this.dropBallsArr[i].positionArray = positionArray;
            this.dropBallsArr[i].y = y - 30;
        },

        /**
         * when we select a new number of rows with the select button we first destroy all the previous data, 
         * balls and pins to prevent memoryload here
         */
        destroyAllAndCreateNew() {
            this.destroyed = true;
            this.mainContainer.removeChildren();
            let _this = this;
            _this.setEnvironmentAccordingToSimulation(this.currentGameIndex);
        },

        /**
         * this function creates history component
         */
        createHistory() {
            this.historyComponent = [];
            let mask = new PIXI.Graphics();
            mask.beginFill(0xfff, 1).drawRoundedRect(0, 0, 50, 200, 20);
            mask.alpha = 0.5;
            mask.position.set(50, 50);


            for (let i = 0; i < 6; i++) {
                let rect = new PIXI.Graphics();
                rect.resolution=3;
                rect.beginFill(0x313644, 1).drawRect(0, 0, 50, 50);
                rect.position.set(50, i * 50);

                let text = new PIXI.Text("25", {
                    fontSize: 18,
                    align: "right",
                    lineHeight: 30,
                    fontWeight: 'bold',
                    wordWrapWidth: this.ballDistance,
                    fill: ['#fff']
                });
                text.resolution = 3;
                text.anchor.set(0.5);
                text.position.set(50 + 25, i * 50 + 25);
                text.name = "history" + i;

                let rectborder = new PIXI.Graphics();
                rectborder.resolution = 3;
                rectborder.beginFill(0x000, 1).drawRect(0, 0, 45, 0.5);
                rectborder.position.set(50 + 2.5, i * 50);
                rectborder.name = "rectborder" + i;

                this.historyComponent[i] = { rect: rect, text: text, rectborder: rectborder };
                this.historyContainer.addChild(rect);
                this.historyContainer.addChild(text);
                this.historyContainer.addChild(rectborder);
            }
            this.historyContainer.addChild(mask);
            this.historyContainer.mask = mask;
        },


        /**
         * this function is called whenever a ball touches our multiplier to now signal the histoy to update
         */
        startMovingMultiplier() {
            if (this.historyIndex < this.historyArr.length && !this.isHistoryMoving && this.historyArr[this.historyIndex]) {
                this.moveHistory(this.historyArr[this.historyIndex].text, 0);
            }
        },

        /**
         * 
         * @param value the value of the multiplier
         * @param i it is the index where we add it before moving
         */
        moveHistory(value, i) {
            this.isHistoryMoving = true;
            this.historyComponent[0] = this.historyComponent[5];
            this.historyComponent[0].rect.position.set(50, i * 50);
            this.historyComponent[0].text.position.set(50 + 25, i * 50 + 25);
            this.historyComponent[0].text.text = value;
            this.historyComponent[0].rectborder.position.set(50 + 2.5, i * 50);

            for (let i = 5; i > 0; i--) {
                this.historyComponent[i] = this.historyComponent[i - 1];
                this.historyComponent[i].rect.beginFill(0x313644, 1).drawRect(0, 0, 50, 50);
            }
            this.historyComponent[0].rect.beginFill(0xFF0000, 1).drawRect(0, 0, 50, 50);
            for (let i = 0; i < 6; i++) {
                this.moveHistoryDown(this.historyComponent[i].rect, 0, i);
                this.moveHistoryDown(this.historyComponent[i].text, 1, i);
                this.moveHistoryDown(this.historyComponent[i].rectborder, 2, i);
            }
        },
        enableAllInputsManual(){
            this.isPlaying=false;
            for (let i = 0; i < this.refArrManual.length; i++) {
                this.$refs[this.refArrManual[i]].disabled = false;
            }
        },
        disableAllInputsManual(){
            this.isPlaying=true;
            for (let i = 0; i < this.refArrManual.length; i++) {
                this.$refs[this.refArrManual[i]].disabled = true;
            }
        },
        enableAllInputs() {
            this.isPlayingAutoplay=false;
            this.isPlaying=false;
            this.autoplayStarted = false;
            this.$refs["clickButton"].innerHTML = "Start AutoBet";
            for (let i = 0; i < this.refArr.length; i++) {
                this.$refs[this.refArr[i]].disabled = false;
            }
        },
        disableAllInputs() {
            this.isPlaying=true;
            for (let i = 0; i < this.refArr.length; i++) {
                this.$refs[this.refArr[i]].disabled = true;
            }
        },

        /**
         * moves individual history blocks
         * @param animObj the history block
         * @param index determines the type of block(rect, its text, and its border)
         * @param symbolIndex this index of the block
         */
        moveHistoryDown(animObj, index, symbolIndex) {
            this.isHistoryMoving = true;
            let tween = gsap.to(animObj.position, {
                duration: 0.2,
                x: animObj.x,
                y: animObj.y + 50
            });
            tween.play();
            let _this = this;
            let timoutPlayHistory = setTimeout(() => {
                if (index === 2 && symbolIndex === 5) {
                    _this.isHistoryMoving = false;
                    _this.historyIndex++;
                    _this.startMovingMultiplier();
                    clearTimeout(timoutPlayHistory);
                }
            }, 210);
        },
        /**
         * the resize code for the game still undex work
         */
        resize() {
            if (window.outerWidth < 700) {
                let width =this.$refs.plinkoDiv.offsetWidth; 
                let height = this.$refs.plinkoDiv.offsetHeight; 
                this.mainContainer.scale.set(0.65);
                this.historyContainer.scale.set(0.65);
                this.historyContainer && this.historyContainer.position.set(width - 80, (height - this.mainContainer.height) / 2);
                this.mainContainer.position.set((width - 5 - this.mainContainer.width) / 2 , (height - this.mainContainer.height) / 2)
            }
            else if (window.outerWidth < 1000) {
                let width =this.$refs.plinkoDiv.offsetWidth; 
                let height = this.$refs.plinkoDiv.offsetHeight; 
                this.mainContainer.scale.set(1);
                this.historyContainer.scale.set(0.65);
                this.historyContainer && this.historyContainer.position.set(width - 80, (height - this.mainContainer.height) / 2);
                this.mainContainer.position.set((width - 5 - this.mainContainer.width) / 2 , (height - this.mainContainer.height) / 2)
            }
            else {
                this.mainContainer.scale.set(1);
                this.historyContainer && this.historyContainer.position.set(800 - 200, (600 - this.mainContainer.height) / 2);
                this.mainContainer.position.set((800 - this.mainContainer.width) / 2, (600 - this.mainContainer.height) / 2);
            }
        }
    },

    mounted() {
        this.gameApp = new PIXI.Application({
            resizeTo: this.$refs.plinkoDiv, backgroundColor: 0x212530, antialias: true,resolution:1
        });

        
        this.configurationData = positionPathArr;
        this.refArr = ["showManual", "ShowAutomatic", "countManual", "halfDivide", "double", "max", "countAutoplay", "halfDivideAutoplay", "doubleAutoplay", "doubleMax", "numberOfBets", "lineSelect", "riskSelect", "lineSelectAutoplay", "riskSelectAutoplay"];
        this.refArrManual = ["showManual","ShowAutomatic","countManual","halfDivide","double","max","lineSelect","riskSelect"];
        this.ballPositions = [];
        this.multiplierValues = [[13,3,1.3,0.7,0.4,0.7,1.3,3,13],[18,4,1.7,0.9,0.5,0.5,0.8,1.7,4,18],[22,5,2,1.4,0.6,0.4,0.6,1.4,2,5,22],[24,6,3,1.8,0.7,0.5,0.5,0.7,1.8,3,6,24],[33,11,4,2,1.1,0.6,0.3,0.6,1.1,2,4,11,33],[43,13,6,3,1.3,0.7,0.4,0.4,0.7,1.3,3,6,13,43],[58,15,7,4,1.9,1,0.5,0.2,0.5,1,1.9,4,7,15,58],[88,18,11,5,3,1.3,0.5,0.3,0.3,0.5,1.3,3,5,11,18,88],[110,41,10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10,41,110]];
        this.inputValues = inputValues;
        this.inputCounter = 0;
        this.gameApp.stage.interactive = true;
        this.$refs.plinkoDiv.appendChild(this.gameApp.view);
        globalThis.__PIXI_APP__ = this.gameApp;
        this.mainContainer = new PIXI.Container();
        this.historyContainer = new PIXI.Container();
        this.currentGameIndex = 8;// the index of the game(number of rows = currentGameIndex+9)
        this.dropBallsArr = [];// the array of the balls being dropped
        this.destroyed = false;
        this.gameApp.stage.addChild(this.mainContainer);
        this.gameApp.stage.addChild(this.historyContainer);
        this.numberOfrow = 16;
        let rows = this.numberOfrow;
        this.historyArr = [];
        this.historyIndex = 0;
        this.isHistoryMoving = false;
        this.autoplayStarted = false;
        this.numberOfBallsAutoPlay = 0;
        this.createHistory();
        // setInterval(this.updatePos.bind(this), 1000 / 60);
        this.gameApp.ticker.add(this.updatePos.bind(this));
        let _this = this;
        this.resize();
        window.addEventListener('resize', function (event) {
            _this.resize();
        }, this);
        this.setEnvironmentAccordingToSimulation(this.currentGameIndex);
    },
};
</script>
