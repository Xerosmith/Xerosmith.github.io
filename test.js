const content = document.getElementById("content")
const box = document.getElementById("box")
const spec = document.getElementById("spec")

let box_stats = {width: 48, height: 10, left: 26, right: 74, top: 45}

let bounding_box = content.getBoundingClientRect()

let bounds = {min_w: 10,
                max_w: 48, // Determined by content's width (-2%)
                min_h: 10,
                max_h: 48, // Determined by content's height (-2%)
                min_x: 26,
                max_x: 74,
                min_y: 25,
                max_y: 75
            }

const size_diff = 4

function resize_box(dx) {
    const neg = dx < 0 ? -1 : 1
    let dw = neg * size_diff
    if (in_bounds(box_stats.width + dw, "width")) {
        let dl = 0, dr = 0

        if (in_bounds(box_stats.left - (dw / 2), "left")) {
            dl = (dw / 2)
        }

        if (in_bounds(box_stats.right + (dw / 2), "right")) {
            dr = (dw / 2)
        }

        if (dl === 0) {
            if (in_bounds(box_stats.right + dw, "right")) {
                dr = dw
            }
            else {
                dw /= 2
            }
        }
        if (dr === 0) {
            if (in_bounds(box_stats.left - dw, "left")) {
                dl = dw
            }
            else {
                dw /= 2
            }
        }

        box_stats.width += dw
        box_stats.left -= dl
        box_stats.right += dr
    }

    box.style.height = "" + box_stats.height + "%"
    box.style.width = "" + box_stats.width + "%"
    box.style.left = "" + box_stats.left + "%"
    box.style.right = "" + box_stats.right + "%"
    box.style.top = "" + box_stats.top + "%"
}

function move_box(new_top, new_left) {
    if (in_bounds(new_top, "y")) {
        box_stats.top = new_top
    }
    if (in_bounds(new_left, "x")) {
        box_stats.left = new_left
        box_stats.right = new_left + box_stats.width
    }

    box.style.left = "" + box_stats.left + "%"
    box.style.right = "" + box_stats.right + "%"
    box.style.top = "" + box_stats.top + "%"

}

function in_bounds(arg, to_test) {
    if (to_test === "width") {
        return arg >= bounds.min_w && arg <= bounds.max_w
    }
    else if (to_test === "height") {
        return arg >= bounds.min_h && arg <= bounds.max_h
    }
    else if (to_test === "x") {
        return arg >= bounds.min_x && arg + box_stats.width <= bounds.max_x
    }
    else if (to_test === "y") {
        return arg >= bounds.min_y && arg + box_stats.height <= bounds.max_y
    }
    else if (to_test === "botom") {
        return arg <= bounds.max_y && arg - box_stats.height >= bounds.min_y
    }
    else if (to_test === "left") {
        return arg >= bounds.min_x
    }
    else if (to_test === "right") {
        return arg <= bounds.max_x
    }
    else {
        return false
    }
}

spec.addEventListener("wheel", e => {
    resize_box(e.deltaY)
})

spec.addEventListener("mousedown", e => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    dragMouseDown(e)
})


function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    let new_top = px_to_percent(box.offsetTop - pos2, "y")
    let new_left = px_to_percent(box.offsetLeft - pos1, "x")
    // new_top = box_stats.top // This line limits movement to x axis only
    
    // console.log("offsetTop: " + box.offsetTop +"\nIn percent: " + px_to_percent(box.offsetTop, "y") +
    //             "\nMy stored values: " + box_stats.top + "\nNew top: " + new_top)
    // console.log("offsetLeft: " + box.offsetLeft +"\nIn percent: " + px_to_percent(box.offsetLeft, "x") +
    //             "\nMy stored values: " + box_stats.left + "\nNew left: " + new_left)
    move_box(new_top, new_left)
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

function px_to_percent(num, axis) {
    const w = window.innerWidth
    const h = window.innerHeight

    if (axis === "x") {
        return num / w * 100
    }
    else {
        return num / h * 100
    }
}


resize_box(0)