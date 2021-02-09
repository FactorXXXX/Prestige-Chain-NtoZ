/*

missions: {
        completed: {
                list: [],
                total: 0,
        },
        maxMissions: 1,
        currentMissions: [
                {
                        requirement: new Decimal(789),
                        getAmount(){
                                return totalChallengeComps("h")
                        },
                        name: "<b>H</b> challenge completions",
                        progress: "lin", //lin, log, exp
                        rewardPassive: .1,
                        rewardOnce: 20,
                        id: 1,
                },
        ],
        money: new Decimal(0),
        moneyPassive: new Decimal(0),
},
*/

var FIXED_MISSION_DATA = {
        1: {
                requirement: new Decimal(789),
                getAmount(){
                        return totalChallengeComps("h")
                },
                name: "<b>H</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.1),
                rewardOnce: new Decimal(20),  
                id: 1,
        },
        2: {
                requirement: new Decimal(357),
                getAmount(){
                        return totalChallengeComps("k")
                },
                name: "<b>H</b> challenge completions",
                progress: "lin", //lin, log, exp
                rewardPassive: new Decimal(.2),
                rewardOnce: new Decimal(30),  
                id: 2,
        },
        3: {
                requirement: Decimal.pow(10, 2000),
                getAmount(){
                        return player.m.points
                },
                name: "<b>M</b>",
                progress: "log", //lin, log, exp
                rewardPassive: new Decimal(.3),
                rewardOnce: new Decimal(40),  
                id: 3,
        }
}


function getMissionProgress(data){
        let req = data.requirement
        let amt = data.getAmount()
        if (data.progress == "lin"){
                return Decimal.div(amt,req).toNumber()
        }
        if (data.progress == "log"){
                if (req.lt(1)) return 0
                return Decimal.div(Decimal.log(amt), Decimal.log(div)).toNumber()
        }
        if (data.progress == "exp"){
                return Decimal.pow(2, Decimal.sub(amt, req)).toNumber()
        }
}

function getNextMission(){
        let data = player.m.missions
        let comp = data.completed
        let curr = data.currentMissions
        for (i = 1; i <= Object.keys(FIXED_MISSION_DATA).length; i ++) {
                if (comp.list.includes(i)) continue
                for (j in curr){
                        k = curr[j]
                        if (k.id == i) continue
                }
                return FIXED_MISSION_DATA[i]
        }
        console.log("OOOPS")
        return FIXED_MISSION_DATA[Object.keys(FIXED_MISSION_DATA).length-1] // for NOW
}

function isMissionComplete(data){
        return Decimal.gte(data.getAmount(), data.requirement)
}

function attemptCompleteMission(id){
        let data2 = player.m.missions
        data = data2.currentMissions[id]
        if (!isMissionComplete(data)) return 
        data2.money = data2.money.plus(data.rewardOnce)
        data2.moneyPassive = data2.moneyPassive.plus(data.rewardPassive)
        data2.currentMissions = data2.currentMissions.slice(0, id).concat(data2.currentMissions.slice(id+1))
        data2.completed.list.push(data.id)
        data2.completed.total ++
        // remove the given mission
}


function getMoneyPerSecond(){
        let ret = player.m.missions.moneyPassive
        return ret
}

function doPassiveMoneyGeneration(diff){
        player.m.missions.money = player.m.missions.money.plus(getMoneyPerSecond().times(diff))
}

function updateMissions(diff){
        let data = player.m.missions
        doPassiveMoneyGeneration(diff)

        for (i in data.currentMissions){
                attemptCompleteMission(i)
        } // check if youve completed them
        
        if (data.maxMissions > data.currentMissions.length){
                data.currentMissions.push(getNextMission())
        } // give new goals if so


        // NOT DONE YET
        // update the displays
}










