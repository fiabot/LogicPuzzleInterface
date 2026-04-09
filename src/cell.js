
const states = ["*", "O", "X", "!", "?"]

let toggleState = (s, setState, select) => {
    if (s == select) {
        setState("*")
    } else {
        setState(select)
    }


    // addUserAction(pid, "mark", {cell, mark}, time)
}

export default Cell = ({ state, setState, mousedown = false, topText = "", leftText = "", select = "*", reveal=false, value="*" }) => {

    let className = "";
    let text = ""

    if (state == "X") {
        className = "notlinked"
        text = "X"
    } else if (state == "O") {
        className = "linked"
        text = "O"
    }
    else if (state == "!") {
        className = "linkedUnsure"
        text = "O"
    } else if (state == "?") {
        className = "notlinkedUnsure"
        text = "X"
    }

    let changeState = () => {
        if (!reveal){
            toggleState(state, setState, select) 
        }else{
            toggleState(state, setState, value) 
        }
    }

    return (<div className="cell" onMouseDown={() => { changeState() }} onMouseEnter={() => { if (mousedown) { changeState() } }}>

        <span className={className}> {text}</span>

    </div>);

}