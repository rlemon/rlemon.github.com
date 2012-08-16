var container = document.getElementById('gallery'),
    spinner = document.getElementById('spinner'),
    total = images.length,
    dim = {
        height: 240,
        width: 320
    };

function fade_in(el, callback) {
    if (el.style.opacity && el.style.opacity <= 1) {
        el.style.opacity = parseFloat(el.style.opacity) + 0.05;
        setTimeout(function() {
            fade_in.apply(this, [el, callback]);
        }, 1000 / 60);
    } else {
        callback.apply(this);
    }
}

function fade_out(el) {
    if (el.style.opacity && el.style.opacity > 0) {
        el.style.opacity = parseFloat(el.style.opacity) - 0.05;
        setTimeout(function() {
            fade_out.apply(this, [el]);
        }, 1000 / 60);
    }
}

function shrink_and_position(el, dimensions) {
    while (el.offsetHeight > dimensions.height / 0.99 && el.offsetWidth > dimensions.width / 0.99) {
        el.style.height = el.offsetHeight * 0.99 + "px";
        el.style.width = el.offsetWidth * 0.99 + "px";
    }
    position_element(el, dimensions);
}

function grow_and_position(el, dimensions) {
    while (el.offsetHeight < dimensions.height / 0.99 || el.offsetWidth < dimensions.width / 0.99) {
        el.style.height = el.offsetHeight / 0.99 + "px";
        el.style.width = el.offsetWidth / 0.99 + "px";
    }
    position_element(el, dimensions);
}

function position_element(el, dimensions) {
    el.style.top = (dimensions.height - el.offsetHeight) / 2 + "px";
    el.style.left = (dimensions.width - el.offsetWidth) / 2 + "px";
}

function toggle_loading_message() {
    var el = document.getElementById('loading-message');
    el.hidden = !el.hidden;
}

function update_image_count() {
    var el = document.getElementById('image-count');
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
    el.appendChild(document.createTextNode((total - images.length) + " of " + total));
}

function click_handler(e) {
    var el = document.getElementById('active-image');
    if (e.srcElement === el) {
        return;
    }
    el.style.height = "240px";
    el.style.width = "320px";
    el.style.zIndex = 9;
    el.id = "";
    shrink_and_position(el.getElementsByTagName('img')[0], {
        height: 240,
        width: 320
    });
    //size_li_element(el, dim);
    document.getElementById('modal').hidden = true;
    document.removeEventListener('click', click_handler, true);
}

function size_li_element(el, dimensions) {
    el.style.height = dimensions.height + "px";
    el.style.width = dimensions.width + "px";
    el.style.position = "relative";
    el.style.top = "";
    el.style.left = "";
}

function load_images() {
    if (images.length === 0) {
        toggle_loading_message();
        return;
    }
    var info = images.shift(),
        li = document.createElement('li'),
        image = document.createElement('img');
    size_li_element(li, dim);
    li.className = 'thumbnail';
    li.style.opacity = 0;
    container.appendChild(li);

    // show spinner here
    spinner.style.top = li.offsetTop + (li.offsetHeight / 2) - 32 + "px";
    spinner.style.left = li.offsetLeft + (li.offsetWidth / 2) - 32 + "px";
    spinner.hidden = false;

    image.src = info.url;
    li.appendChild(image);


    if (info.title) {
        var title = document.createElement('header');
        title.innerHTML = info.title; // ugh
        li.appendChild(title);
    }
    if (info.footer) {
        var footer = document.createElement('footer');
        footer.innerHTML = info.footer; // ditto
        li.appendChild(footer);
    }
    li.onclick = function() {
        this.style.height = "400px";
        this.style.width = "600px";
        this.id = "active-image";
        this.style.zIndex = 999;
        var modal = document.getElementById('modal'),
            img = this.getElementsByTagName('img')[0];
        grow_and_position(img, {
            height: 400,
            width: 600
        });
        // recenter the li
        modal.hidden = false;
        //this.style.top = /*screen.innerHeight / 2 - */ 175 + "px";
        //this.style.left = window.innerWidth / 2 - 300 + "px";
        document.addEventListener('click', click_handler, true);
    };
    image.onload = function() {
        spinner.hidden = true;
        update_image_count();
        shrink_and_position(this, dim);
        fade_in(this.parentNode, function() {
            setTimeout(load_images, 1);
        });
    };
}

toggle_loading_message();
load_images();
