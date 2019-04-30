
// return youtube cdn thumbnail url from id
export function thumbnail_url(id) { 
    return 'http://i3.ytimg.com/vi/' + id + '/hqdefault.jpg';
}

// return youtube video url from id
export function video_url(id) { 
    return 'https://youtube.com/watch?v=' + id; 
}

// truncate string to desired length and add elipses
export function truncate_str(str, len){
    if (str.length < len) { return str; }
    return str.substring(0, len-3) + "...";
}