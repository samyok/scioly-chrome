# Bookmarklet code

```javascript
javascript:(function () {
    function callback() {
        (function ($) {
            let jQuery = $;

            function callback() {
                console.log("loaded")
            }

            let s = document.createElement("script");
            s.src = "https://nepaltechguy2.github.io/scioly-chrome/bookmarklet.js?_="+Date.now();
            if (s.addEventListener) {
                s.addEventListener("load", callback, false)
            } else if (s.readyState) {
                s.onreadystatechange = callback
            }
            document.body.appendChild(s);
        })(jQuery.noConflict(true))
    }

    let s = document.createElement("script");
    s.src = "https://nepaltechguy2.github.io/scioly-chrome/vendor/jquery-3.4.1.min.js";
    if (s.addEventListener) {
        s.addEventListener("load", callback, false)
    } else if (s.readyState) {
        s.onreadystatechange = callback
    }
    document.body.appendChild(s);
})();
```

Single line: 
```
javascript:!function(){function e(){!function(e){function t(){console.log("loaded")}let n=document.createElement("script");n.src="https://nepaltechguy2.github.io/scioly-chrome/bookmarklet.js",n.addEventListener?n.addEventListener("load",t,!1):n.readyState&&(n.onreadystatechange=t),document.body.appendChild(n)}(jQuery.noConflict(!0))}let t=document.createElement("script");t.src="https://nepaltechguy2.github.io/scioly-chrome/vendor/jquery-3.4.1.min.js",t.addEventListener?t.addEventListener("load",e,!1):t.readyState&&(t.onreadystatechange=e),document.body.appendChild(t)}();
```