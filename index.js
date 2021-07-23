//to do
//validation
//accessibility
//learn html tables
//styling

//DOM elements
const desVol = document.getElementById("des-vol")
const desNic = document.getElementById("des-nic")
const desVg = document.getElementById("des-vg")
const desPg = document.getElementById("des-pg")
const pgVgSlider = document.getElementById("pg-vg")
const flavNum = document.getElementById("flavour-num")
const flavInputs = document.getElementById("flav-inputs")
const desFlav = document.getElementById("flavour-input")
const flavourisVG = document.getElementById("flavourisVG")
const nicStr = document.getElementById("nicstrength-input")
const nicVg = document.getElementById("nic-vg")
const nicPg = document.getElementById("nic-pg")
const resPg = document.getElementById("res-pg")
const resVg = document.getElementById("res-vg")
const resNic = document.getElementById("res-nic")
const resFlavEl = document.getElementById("resflav-el")
const calcBtn = document.getElementById("calc-btn")

let totalVg = 0 //amount of VG for recipe output
let totalPg = 0 //amount of PG for recipe output
let totalNic = 0 //amount of nicotine for recipe output

let flavours = [] //array for flavours inputs
let flavoursVol = [] //array for calculated flavours outputs

//routine for 'calculate' button, calculate then render
calcBtn.addEventListener("click", function() {
  calculate()
  render()
})

//routine to calculate VG proportion on change to PG proportion
desPg.addEventListener("change", function() {
  if(desPg.value > 100){
    desPg.value = 100
  } else if (desPg.value < 0) {
    desPg.value = 0
  }
  desVg.value = 100 - desPg.value
  pgVgSlider.value = desPg.value

})

//routine to calculate PG proportion on change to VG proportion
desVg.addEventListener("change", function() {
  if(desVg.value > 100){
    desVg.value = 100
  } else if (desVg.value < 0) {
    desVg.value = 0
  }
  desPg.value = 100 - desVg.value
  pgVgSlider.value = desPg.value
})

//routine to copy range slider values to inputs
pgVgSlider.addEventListener("input", function() {
desVg.value = 100 - pgVgSlider.value
desPg.value = pgVgSlider.value
})

//routine to calculate nic VG proportion on change to nic PG proportion
nicPg.addEventListener("change", function() {
  if(nicPg.value > 100){
    nicPg.value = 100
  } else if (nicPg.value < 0) {
    nicPg.value = 0
  }
  nicVg.value = 100 - nicPg.value
})

//routine to calculate nic PG proportion on change to nic VG proportion
nicVg.addEventListener("change", function() {
  if(nicVg.value > 100){
    nicVg.value = 100
  } else if (nicVg.value < 0) {
    nicVg.value = 0
  }
  nicPg.value = 100 - nicVg.value
})

//listener for changing number of flavours
flavNum.addEventListener("change", function() {
  buildFlavList()
})

//on change to number of flavours, build arrays and update DOM to create relevant fields
function buildFlavList() {
  flavours = []
  let flavinstr = ""
  let flavoutstr = ""
  for (let i = 0; i < flavNum.value; i++) {
    flavours.push(0)
  }
  for (var i = 0; i < flavours.length; i++) {
    flavinstr += `
    <tr><td><label for="flavour${i}">Flavouring ${i + 1} (%): </label></td><td><input type="number" name="flavour${i}" value="0" id="flavour-input${i}"></td>
    <td><label for="flavourisVG${i}">VG:</label><input type="checkbox" name="flavourisVG${i}" id="flavourisVG${i}"></td></tr>
    `
    flavoutstr +=`
    <tr><td>Flavour ${i + 1}: </td><td id="res-flav${i}"></td>
    `
    }
    flavInputs.innerHTML = flavinstr
    resFlavEl.innerHTML = flavoutstr
}

//calculate volumes for recipe output
function calculate() {
// running total of PG/VG in each ingredient
    let runningPg = 0
    let runningVg = 0
// valculate volume of nicotine concentrate
    totalNic = desNic.value / nicStr.value * desVol.value
    runningPg += nicPg.value / 100 * totalNic
    runningVg += nicVg.value / 100 * totalNic
// build flavours array
    for (var i = 0; i < flavours.length; i++) {
      let el = "flavour-input" + i
      console.log(el);
      let perc = document.getElementById(el).value
      flavours[i] = perc
    }
// calculate volume of each flavour (check for VG) and save to flavoursVol array
    flavoursVol = []
    for (let i = 0; i < flavours.length; i++) {
      let calc = flavours[i] / 100 * desVol.value
      flavoursVol.push(calc)
      let el = "flavourisVG" + i
      if(document.getElementById(el).checked) {
        runningVg += calc
      } else {
        runningPg += calc
      }
    }

// calculate volumes of VG/PG required, adjusting for amount already added
    totalVg = (desVg.value / 100 * desVol.value) - runningVg
    totalPg = (desPg.value / 100 * desVol.value) - runningPg
}

// render results
function render() {
    resPg.textContent = `${Math.round(totalPg * 10) / 10} ml`
    resVg.textContent = `${Math.round(totalVg * 10) / 10} ml`
    resNic.textContent = `${Math.round(totalNic * 10) / 10} ml`

    for (let i = 0; i < flavoursVol.length; i++) {
      let el = "res-flav" + i
      let str = `${Math.round(flavoursVol[i] * 10) / 10} ml`
      document.getElementById(el).textContent = str
    }
}
