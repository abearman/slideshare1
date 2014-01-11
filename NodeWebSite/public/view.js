var acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
};
var workspace = null;
var canvas = null;
var thumbnail_bar = null;
var next_button = null;
var prev_button = null;
var caption = null;
var upload_field = null;

var slides = [];
var current_slide = -1;

var currently_dragging_slide = null;
var drag_start_x = 0;
var drag_start_y = 0;

function main() {
    next_button = document.getElementById('next_button');
    next_button.onclick = next_slide;
    prev_button = document.getElementById('prev_button');
    prev_button.onclick = prev_slide;
}

window.onload = main;

function next_slide() {
    set_slide((current_slide+1)%(slides.length));
}

function prev_slide() {
    if (current_slide==0) {
        set_slide(slides.length-1);
    }
    else {
        set_slide((current_slide-1)%(slides.length));
    }
}

