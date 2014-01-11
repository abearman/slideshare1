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
   workspace = document.getElementById('workspace');
   canvas = document.getElementById('workspace');
   next_button = document.getElementById('next_button');
   next_button.onclick = next_slide;
   next_button.hidden = true;
   prev_button = document.getElementById('prev_button');
   prev_button.onclick = prev_slide;
   prev_button.hidden = true;
   thumbnail_bar = document.getElementById('thumbnail_bar');
   thumbnail_bar.hidden = true;
   caption = document.getElementById('caption');
   caption.hidden = true;
   caption.onkeyup=caption_edited;
   upload_field = document.getElementById('upload-field');

   workspace.ondragover = function () { 
       upload_field.style.border = "10px dashed rgb(150, 150, 150)";
       return false; 
   };
   workspace.ondragleave = function () {
       upload_field.style.border = "10px dashed rgb(40, 40, 50)"; 
       return false; 
   };

   function addToDatabase(url) {
        console.log(url);
        var method = "post";
        var path = "/";
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", 'name');
        hiddenField.value = url;
        form.appendChild(hiddenField);
        console.log(hiddenField);
        console.log(form);
        document.body.appendChild(form);
        form.submit();
    }

   workspace.ondrop = function(e) {
       e.preventDefault();
       readfiles(e.dataTransfer.files);
       //addToDatabase(e);
   };
   window.setInterval(timer,50);
}

window.onload = main;

function timer() {
   for (var i = 0; i < slides.length; i++) {
       var delta = ((current_slide-i)*5)-slides[i].thumbnailfade;
       slides[i].thumbnailfade += delta*0.1;
       slides[i].thumbnail.style.webkitTransform = "perspective(380px) rotateY("+slides[i].thumbnailfade+"deg)";
       slides[i].thumbnail.style.opacity = 1.0-Math.abs(slides[i].thumbnailfade/80);
   }
}

function caption_edited() {
   if (current_slide != -1) {
       slides[current_slide].caption = caption.value;
   }
}

function mouse_down(e,slide) {
   currently_dragging_slide = slide;
   var leftStyle = slide.thumbnail.style.left.replace("px","");
   var leftOffset = 0;
   if (leftStyle.length != 0) {
       leftOffset = parseInt(slide.thumbnail.style.left.replace("px",""));
   }
   drag_start_x = e.clientX - leftOffset;
}

function mouse_move(e) {
   if (currently_dragging_slide != null) {
       var deltaX = e.clientX - drag_start_x;
       currently_dragging_slide.thumbnail.style.position = "relative";
       currently_dragging_slide.thumbnail.style.left = deltaX+"px";
       currently_dragging_slide.thumbnail.style.top = "0px";
   }
}

function mouse_up(e) {
   if (currently_dragging_slide != null) {
       var deltaX = e.clientX - drag_start_x;
       if (Math.abs(deltaX) > 10) {
           var steps = Math.ceil(((Math.abs(deltaX)-50)/100))*(Math.abs(deltaX)/deltaX);
           var old_index = currently_dragging_slide.index;
           var new_index = old_index+steps;
           if (new_index > slides.length-1) new_index = slides.length-1;
           if (new_index < 0) new_index = 0;
           slides.splice(old_index,1);
           slides.splice(new_index,0,currently_dragging_slide);
           refresh_thumbnails();
       }
       else {
           currently_dragging_slide.thumbnail.style.left = "0px";
           set_slide(currently_dragging_slide.index);
       }

       currently_dragging_slide.thumbnail.style.position = "";
       currently_dragging_slide = null;
   }
}

document.onmouseup = mouse_up;
document.onmousemove = mouse_move;

function set_slide(index) {
   if (slides.length > 1) {
       next_button.hidden = false;
       prev_button.hidden = false;
   }
   if (current_slide != -1 && slides[current_slide].slide.parentNode == workspace) {
       canvas.removeChild(slides[current_slide].slide);
   }
   current_slide = index;
   canvas.appendChild(slides[current_slide].slide);
   caption.value = slides[current_slide].caption;
   refresh_thumbnails();
}

function refresh_thumbnails() {
   for (var i = 0; i < slides.length; i++) {
       if (slides[i].thumbnail.parentNode == thumbnail_bar) {
           thumbnail_bar.removeChild(slides[i].thumbnail);
       }
   }
   var current_slide_old = current_slide;
   for (var i = 0; i < slides.length; i++) {
       if (slides[i].index === current_slide_old) {
           current_slide = i;
       }
   }
   for (var i = 0; i < slides.length; i++) {
       slides[i].index = i;
       thumbnail_bar.appendChild(slides[i].thumbnail);
       slides[i].thumbnail.style.left = "";
   }
}

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

function add_slide(file) {
   thumbnail_bar.hidden = false;
   caption.hidden = false;
   upload_field.hidden = true;
   if (acceptedTypes[file.type] === true) {
       var reader = new FileReader();
       reader.onload = function (e) {

           // Create the image object for the slide

           var slide_image = new Image();
           slide_image.src = e.target.result;
           slide_image.style.height = "100%";
           var slide = document.createElement("div");
           slide.appendChild(slide_image);

           // Create the thumbnail

           var thumb_image = new Image();
           thumb_image.src = e.target.result;
           thumb_image.style.height = "100%";
           var thumbnail = document.createElement("div");
           thumbnail.appendChild(thumb_image);
           thumb_image.className = "thumbnail";
           thumbnail.className = "thumbnail-wrapper";
           thumbnail.draggable = false;
           thumb_image.draggable = false;

           // Add slide

           var new_slide = {
               "slide" : slide,
               "thumbnail" : thumbnail,
               "caption" : "",
               "thumbnailfade" : 0
           };
           slides.splice(current_slide+1,0,new_slide);

           // Insert the thumbnail

           refresh_thumbnails();

           // Add the hook for draggin the slide around

           thumbnail.onmousedown = function(e) {
               mouse_down(e,new_slide);
           }

           set_slide(current_slide+1);

           // Upload

           /*filepicker.setKey('ANJlpHksZSrqWDRC0FtL9z');
           filepicker.store(e.target.result, {base64encode: false, mimetype:"image/jpeg"}, function(InkBlob) {
                   console.log("Store successful:", JSON.stringify(InkBlob));
               }, function(FPError) {
                   console.log(FPError.toString());
               }, function(progress) {
                   console.log("Loading: "+progress+"%");
               }
           );*/
       }
       reader.readAsDataURL(file);
   }
}

function readfiles(files) {
   for (var i = 0; i < files.length; i++) {
       add_slide(files[i]);
   }
}