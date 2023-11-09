const headlight = document.getElementById("headlight");
const frontYellow = document.getElementById("frontYellow");
const frontOrange = document.getElementById("frontOrange");
const frontRed = document.getElementById("frontRed");
const backYellow = document.getElementById("backYellow");
const backOrange = document.getElementById("backOrange");
const backRed = document.getElementById("backRed");

const apiSensors = "개인firebaseJSON키"
const request = new XMLHttpRequest()

window.addEventListener("load", function(){
    request.open("GET", apiSensors)
    request.addEventListener("load", function(){
        const response = JSON.parse(request.response);

        const brightness = parseInt(Object.values(response.BriValue).at(-1).briValue.slice(0, 2));
        const frontDistance = parseFloat(Object.values(response.FrontDistance).at(-1).frontDistance.slice(1, 5));
        const backDistance = parseFloat(Object.values(response.BackDistance).at(-1).backDistance.slice(1, 5));

        const headlight = document.getElementById("headlight");
        if (brightness >= 0 && brightness <= 100) {
            if (brightness <= 50) {
                headlight.classList.remove("off");
                headlight.classList.add("on");
            } else {
                headlight.classList.remove("on");
                headlight.classList.add("off");
            }
        }

        const frontCoution = document.getElementById("frontCoution");
        if(frontDistance <= 15.0) {
            if(frontDistance > 10.0) {
                frontCoution.classList.remove("off");
                frontCoution.classList.remove("frontRed");
                frontCoution.classList.remove("frontOrange");
                frontCoution.classList.add("frontYellow");
            }
            else if(frontDistance <= 10.0 && frontDistance > 5.0) {
                frontCoution.classList.remove("off");
                frontCoution.classList.remove("frontRed");
                frontCoution.classList.remove("frontYellow");
                frontCoution.classList.add("frontOrange");
            }
            else if(frontDistance <= 5.0) {
                frontCoution.classList.remove("off");
                frontCoution.classList.remove("frontOrange");
                frontCoution.classList.remove("frontYellow");
                frontCoution.classList.add("frontRed");
            }
        }
        else{
            frontCoution.classList.remove("frontRed");
            frontCoution.classList.remove("frontOrange");
            frontCoution.classList.remove("frontYellow");
            frontCoution.classList.add("off");
        }

        const backCoution = document.getElementById("backCoution");
        if(backDistance <= 15.0) {
            if(backDistance > 10.0) {
                backCoution.classList.remove("off");
                backCoution.classList.remove("backRed");
                backCoution.classList.remove("backOrange");
                backCoution.classList.add("backYellow");
            }
            else if(backDistance <= 10.0 && frontDistance > 5.0) {
                backCoution.classList.remove("off");
                backCoution.classList.remove("backRed");
                backCoution.classList.remove("backYellow");
                backCoution.classList.add("backOrange");
            }
            else if(backDistance <= 5.0) {
                backCoution.classList.remove("off");
                backCoution.classList.remove("backOrange");
                backCoution.classList.remove("backYellow");
                backCoution.classList.add("backRed");
            }
        }
        else{
            backCoution.classList.remove("backRed");
            backCoution.classList.remove("backOrange");
            backCoution.classList.remove("backYellow");
            backCoution.classList.add("off");
        }
    })
})